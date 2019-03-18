#!/usr/bin/env node

/*! Copyright (c) 2018 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const yargs = require('yargs');

const Poppy = require('../lib/Poppy');

const cliOptions = require('./cli-options'),
    OptionHelper = cliOptions.OptionHelper,
    getPoppyConfiguration = cliOptions.getPoppyConfiguration
;

let epilogue = 'Poppy CLI. (c)2018 N. Barikipoulos. Released under the MIT license.\n'
    + 'More details on http://github.com/nbarikipoulos/poppy-robot-client'
;

//////////////////////////////////
//////////////////////////////////
// Instantiate a Poppy object to 
// get its configuration.
//////////////////////////////////
//////////////////////////////////

//FIX ME allow to change the config (set to poppy ergo jr)
let poppy = undefined;

try {
    poppy = new Poppy(
        getPoppyConfiguration(yargs.argv)
    );
} catch (error) {
    console.log('Unable to create Poppy object:')
    console.log(error.message);
    process.exit(-1); // without any poppy instance, nothing is possible
}

// And then, instantiate helper for CLI use which need a Poppy instance
// to dynamically fill the motor options with motor ids.
let optionHelper = new OptionHelper();
optionHelper.init(poppy);

//////////////////////////////////
//////////////////////////////////
// Main help
//////////////////////////////////
//////////////////////////////////

yargs
    .usage(`Usage: $0 <command> --help for detailed help`)
    .demandCommand(1,'Use at least one command')
    .strict()
    .epilogue(epilogue)
    .locale('en')
    .version()
    .alias('h','help')
    .help('h')
    .showHelpOnFail(true)
;

//////////////////////////////////
//////////////////////////////////
// Add executing command
//////////////////////////////////
//////////////////////////////////

require('./exec-commands')(yargs, {optionHelper, poppy});

//////////////////////////////////
//////////////////////////////////
// Add querying robot commands
//////////////////////////////////
//////////////////////////////////

require('./query-commands')(yargs, {optionHelper, poppy});

//////////////////////////////////
//////////////////////////////////
// Add Configuration/Discovering robot commands
//////////////////////////////////
//////////////////////////////////

require('./config-command')(yargs, {optionHelper, poppy});

//////////////////////////////////
//////////////////////////////////
// "Main" job :)
//////////////////////////////////
//////////////////////////////////

yargs
    .wrap(yargs.terminalWidth())
    .argv
;
