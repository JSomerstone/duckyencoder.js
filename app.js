/**
 * Created by jsomerstone on 11/4/13.
 */

var
    encoder = require('./include/encoder.js'),
    keyboardLayout = require('./include/keyboardLayout.js'),
    fs = require('fs');

//console.log(encoder);

var stuff = fs.readFileSync('combos.txt').toString(),
    layoutSettings = fs.readFileSync('layouts/default.json').toString();

keyboardLayout.setLayout(JSON.parse(layoutSettings));

encoder.verbose = true;
encoder.setLayout(keyboardLayout);
encoder.read(stuff)
    .parse();

console.log(encoder.file);