#!/usr/bin/env node

/*!
 * (The MIT License)
 *
 * Copyright (c) 2018 N. Barikipoulos <nikolaos.barikipoulos@outlook.fr>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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
let poppy = new Poppy(
    getPoppyConfiguration(yargs.argv)
);

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
// Add the initialization command
//////////////////////////////////
//////////////////////////////////

require('./init-command')(yargs, {optionHelper, poppy});

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
// "Main" job :)
//////////////////////////////////
//////////////////////////////////

yargs
    .wrap(yargs.terminalWidth())
    .argv
;
