/**
 * Created by jsomerstone on 11/6/13.
 */
var encoder = require('../include/encoder.js'),
    actualLayout = require('../include/keyboardLayout.js'),
    fs = require('fs'),
    layoutSettings = fs.readFileSync(__dirname + '/../layouts/default.json').toString(),
    localeSettings = fs.readFileSync(__dirname + '/../layouts/gb.json').toString();

actualLayout.setLayout(JSON.parse(layoutSettings))
    .setLocale(JSON.parse(localeSettings));
module.exports =
{
    setUp: function (callback) {
        encoder.verbose = false;
        encoder.layout = actualLayout;
        callback();
    },

    tearDown: function (callback) {
        encoder.file = [];
        encoder.lastCommand = [];
        callback();
    },

    testReadingScript: function (test) {
        encoder.read("CTRL-ALT DELETE");
        test.deepEqual(encoder.file, []);
        test.deepEqual(encoder.instructions, ['CTRL-ALT DELETE']);
        test.done();
    },

    testParsingWithoutLayoutThrows : function(test)
    {
        encoder.layout = null;
        test.throws(encoder.parse);
        test.done();
    },

    testParsingDelay : function(test)
    {
        encoder.layout = getDummyLayout(1);
        encoder.read("DELAY 5").parse();
        test.deepEqual(encoder.file, [0,5]);
        test.done();
    },
    testParsingString : function(test)
    {
        encoder.read('STRING abcd').parse();
        test.deepEqual(encoder.file, [4, 0, 5, 0, 6, 0, 7, 0]);
        test.done();
    },

    testReadingIntroductionTypesExpected : function(test)
    {
        var data = provideInstructionsAndExpectedOutcome();
        for (var i = 0, max = data.length; i < max ; i++)
        {
            encoder.file = [];
            encoder.readInstructions(data[i].input);
            test.deepEqual(
                encoder.file,
                data[i].output,
                "Parsing of '" + data[i].input + "' failed"
            );
        }
        test.done();
    },

    testLastCommandIsStored : function(test)
    {
        encoder.readInstructions('STRING a');
        encoder.readInstructions('DELAY 1');
        test.deepEqual([0,1], encoder.lastCommand);
        test.done();
    },

    testCommandIsRepeated : function(test)
    {
        encoder.readInstructions('DELAY 8');
        encoder.readInstructions('REPEAT 2');
        test.deepEqual([0, 8,0, 8,0, 8], encoder.file);
        test.done();
    }
};

getDummyLayout = function(returns)
{
    return {
        getKey: function(key)
        {
            return returns;
        }
    };
}

provideInstructionsAndExpectedOutcome = function()
{
    return [
        {
            input : 'DELAY 2',
            output : [0,2]
        },
        {
            input : 'REM Anything beyond this gets ignored',
            output : []
        },
        {
            input : 'STRING abba',
            output : [4, 0, 5, 0, 5, 0, 4, 0]
        },
        {
            input : 'GUI r',
            output : [21, 8]
        },
        {
            input : 'WINDOWS r',
            output : [21, 8]
        },
        {
            input : 'CONTROL s',
            output : [22, 1]
        },
        {
            input : 'CTRL s',
            output : [22, 1]
        },
        {
            input : 'ALT F4',
            output : [61, 4]
        },
        {
            input : 'CTRL-ALT DELETE',
            output : [76, 5]
        },
        {
            input : 'CTRL-SHIFT x',
            output : [27, 3]
        },
        {
            input : 'ALT-SHIFT',
            output : [226, 6]
        },
    ];
}
