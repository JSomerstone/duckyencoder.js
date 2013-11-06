/**
 * Created by jsomerstone on 11/6/13.
 */
var encoder = require('../include/encoder.js');

module.exports =
{
    setUp: function (callback) {
        encoder.verbose = true;
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
    }
};