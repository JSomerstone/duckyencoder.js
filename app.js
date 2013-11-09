/**
 * Created by jsomerstone on 11/4/13.
 */

var
    encoder = require('./include/encoder.js'),
    keyboardLayout = require('./include/keyboardLayout.js'),
    fs = require('fs');

//console.log(encoder);

    var duckyScript = fs.readFileSync('/tmp/cmd.script').toString(),
    layoutSettings = fs.readFileSync('layouts/default.json').toString();

keyboardLayout.setLayout(JSON.parse(layoutSettings));

encoder.verbose = true;
encoder.setLayout(keyboardLayout);
var binary = encoder.read(duckyScript).parse().getFile();

fs.writeFile('/tmp/output.bin', binary, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
});
