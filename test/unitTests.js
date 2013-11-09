/**
 * Created by jsomerstone on 11/6/13.
 */
var encoder = require('../include/encoder.js'),
    actualLayout = require('../include/keyboardLayout.js'),
    fs = require('fs'),
    layoutSettings = fs.readFileSync(__dirname + '/../layouts/default.json').toString();

actualLayout.setLayout(JSON.parse(layoutSettings));
module.exports =
{
    setUp: function (callback) {
        encoder.verbose = false;
        callback();
    },

    tearDown: function (callback) {
        // clean up
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
        encoder.layout = getDummyLayout(1);
        encoder.read('STRING abcd').parse();
        test.deepEqual(encoder.file, [97, 98, 99, 100]);
        test.done();
    },

    testReadingIntroductionTypesExpected : function(test)
    {
        encoder.layout = actualLayout;
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
            output : [97, 98, 98, 97]
        },
        {
            input : 'GUI r',
            output : [21, 8]
        },
        {
            input : 'WINDOWS r',
            output : [21, 8]
        },
    ];
}
