/*!
 * (The MIT License)
 *
 * Copyright (c) 2018 N. Barikipoulos <nikolaos.barikipoulos@outlook.fr>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * 
 * This module is the main entry point for poppy robot client.
 * It contains factories for high-level objects of this module
 * _i.e._ for Poppy and Script Objects.
 * 
 * As user facing module, It exports the poppy-robot-client primary
 * public API and provides convenience accessors to certain sub-modules.
 * 
 * The poppy-robot-client is mainly based on the following objects:
 * - The Poppy object which handles:
 *      - The robot configuration and then, the motors objects,
 *      - The script execution engine.
 * - The Motor Objects:
 *      - ExtMotorRequest which handles high level actions of the motors,
 *      - RawMotorRequest which handles the low-level rest requests to the motor registry.
 * - The RequestHandlerObject object in charge of all the requests the http server,
 * - The Script object in order to develop scripts.
 * 
 * Furthermore, Note it automatically appends a set of optional flags in order to set
 * the connection to poppy:
 * 
 * option | desc | value | default
 * --- | --- | --- | --- 
 * -i/--ip | Set the Poppy IP/hostname | string | poppy.local
 * -p/--http-port | Set the http server port on Poppy | integer | 8080
 * -P/--snap-port | Set the snap server port on Poppy | integer | 6969
 * 
 * @module poppy-robot-client
 * @typicalname P
 * @version 2.0.0
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
const RawMotorRequest = require('./lib/motor/ExtMotorRequest');
const PoppyRequestHandler = require('./lib/utils/PoppyRequestHandler');


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

/**
 * Factory which creates the main module object: the Poppy one.
 * 
 * As the Poppy object is both in charge of the connection to the Poppy and
 * it handles the robot configuration, this factory allows modifying 
 * the settings for these properties.
 * 
 * Note:
 * - Intantitating a poppy object without any settings will use ones
 * by default _i.e._ for a poppy ergo jr,
 * - This factory automatically reads the settings provided by both the .poppyrc
 *  file and and CLI options in this order:
 *      - It first checks if a .poppyrc file exists, and then it reads it,
 *      - On a second hand, it uses the CLI settings, if any, and then it will override the corresponding values,
 *      - At last, it will override these settings with values passed through the arguments of this factory.
 *  
 * 
 * @param {Object=} options - settings object
 * @param {module:poppy-robot-client~DescriptorLocator=} options.descriptor - Descriptor locator (for advanced users only)
 * @param {module:poppy-robot-client~ConnectionSettings=} options.connect - Connection Settings to Poppy
 * @type {module:poppy-robot-client~Poppy}
 * @static
 * @see {@link module:poppy-robot-client~Poppy}
 * 
 * @example
 * const P = require('poppy-robot-client'); 
 * 
 * let poppy = P.createPoppy(); // create a poppy object
 *                              // using default settings for a Poppy Ergo Jr.
 * 
 * let anotherPoppy = P.createPoppy({ // Another Poppy Ergo Jr...
 *      connect : { // ...with custom connection settings: 
 *          ip: poppy1.local // hostname set to poppy1.local
 *          httpPort: 8081   // and http server on port 8081
 *      }
 * });
 */
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

/**
 * Convinient factory in order to create a new Poppy Script Object.
 * It optionally allows selecting a bunch of motor (identified by their names) or
 * all motors to apply to next actions until call to the select method, if any.
 * 
 * @param {...string=} motorId - the motor id/name or 'all' to select all motors
 * @type {module:poppy-robot-client~Script}
 * @static
 * @see {@link module:poppy-robot-client~Script}
 * @example
 * const P = require('poppy-robot-client');
 * 
 * // Instantiate a new script and automatically target all motors
 * let myScript = P.createScript('all');
 * 
 * // It is equivalent to
 * let myOtherScript = P.createScript()
 *     .select('all')
 * ;
 * 
 * // Create another script selecting only motor 'm1' and 'm2'
 * let anotherScript = P.createScript('m1','m2');
 * 
 */
let createScript = (...motorIds) => new Script(...motorIds);

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
    ExtMotorRequest,
    RawMotorRequest,
    PoppyRequestHandler
};