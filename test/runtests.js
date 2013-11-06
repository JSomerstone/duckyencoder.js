module.exports = {

    encoder: null,

    setUp: function (callback)
    {
        this.encoder = require('../include/encoder.js');
        var layout = require('../include/keyboardLayout.js'),
            layoutSettings = require('fs').readFileSync(__dirname + '/../layouts/default.json').toString();

        layout.setLayout(JSON.parse(layoutSettings));
        this.encoder.setLayout(layout);

        callback();
    }

    , testLayoutIsSet: function (test) {
        test.notEquals(this.encoder.layout, null);
    }
};