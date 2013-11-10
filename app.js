/**
 * Created by jsomerstone on 11/4/13.
 */

var encoder = require('./include/encoder.js'),
    keyboardLayout = require('./include/keyboardLayout.js'),
    fs = require('fs'),
    commander = require('./vendor/commander.js/index.js');

commander.version('0.0.1')
    .option('-i, --input <filename>', 'Input ducky script')
    .option('-o, --output <filename>', 'File to save encoded script')
    .option('--debug', 'Verbose-mode')
    .parse(process.argv);

if ( ! commander.input )
    return console.log('Missing mandatory --input');

if ( ! commander.output )
    return console.log('Missing mandatory --output');

var duckyScript = fs.readFileSync(commander.input).toString(),
    layoutSettings = fs.readFileSync('layouts/default.json').toString(),
    localeSettings = fs.readFileSync('layouts/gb.json').toString();

keyboardLayout.setLayout(JSON.parse(layoutSettings))
    .setLocale(JSON.parse(localeSettings));

if (commander.debug)
    encoder.verbose = true;

encoder.setLayout(keyboardLayout);
var binary = encoder.read(duckyScript).parse().getFile();

fs.writeFile(
    commander.output,
    binary,
    function (err) {
    if (err) throw err;
});
