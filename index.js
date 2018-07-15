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

const cliOptions = require('./bin/cli-options'),
    OptionHelper = cliOptions.OptionHelper,
    getPoppyConfiguration = cliOptions.getPoppyConfiguration
;

const Script = require('./lib/Script');
const Poppy = require('./lib/Poppy');
const ExtMotorRequest = require('./lib/motor/ExtMotorRequest');


//////////////////////////////////
// Automatically add CLI options 
// for Poppy configuration to any scripts
//////////////////////////////////

yargs
    .locale('en')
    .alias('h','help')
    .help('h')
;

let optionHelper = new OptionHelper();
optionHelper.addPoppyConfigurationOptions(yargs);

yargs
    .wrap(yargs.terminalWidth())
    .argv
;

//////////////////////////////////
// Main object factories
//////////////////////////////////

let createScript = (...motorIds) => new Script(...motorIds);

let createPoppy = (options) => {

    // First let's obtain the configuration
    let config = Object.assign( {},
        getPoppyConfiguration(yargs.argv), // read from .poppyrc and CLI
        options // from arguments
    );

    // At last, instantiate the Poppy object
    let poppy = undefined;
    try {
        poppy = new Poppy(config);
    } catch (error) {
        console.log('Unable to create Poppy object:')
        console.log(error.message);
        process.exit(-1); // without any poppy instance, nothing is possible
    }

    return poppy;
}


//////////////////////////////////
// Main object factories
//////////////////////////////////

//////////////////////////////////
//////////////////////////////////
// Public API
//////////////////////////////////
//////////////////////////////////

module.exports = {
    createScript,
    createPoppy,
    Script,
    Poppy,
    Motor: ExtMotorRequest
};