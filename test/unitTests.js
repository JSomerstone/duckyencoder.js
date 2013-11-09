/**
 * Created by jsomerstone on 11/6/13.
 */
var encoder = require('../include/encoder.js');
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