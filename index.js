/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

/**
 * This module is the main entry point for poppy robot core.
 * It contains factories for high-level objects of this module
 * _i.e._ for Poppy and Script Objects.
 *
 * As user facing module, It exports the poppy-robot-core primary
 * public API and provides convenience accessors to certain sub-modules.
 *
 * The poppy-robot-core is mainly based on the following objects:
 * - The Poppy object which handles:
 *      - The robot configuration and then, the motors objects,
 *      - The script execution engine.
 * - The Motor Objects:
 *      - ExtMotorRequest which handles high level actions of the motors,
 *      - RawMotorRequest which handles the low-level rest requests to the motor registry.
 * - The RequestHandlerObject object in charge of all the requests the http server,
 * - The Script object in order to develop scripts.
 *
 * @module poppy-robot-core
 * @typicalname P
 * @version 3.1.2
 */

'use strict'

const Poppy = require('./lib/Poppy')

const ExtMotorRequest = require('./lib/motor/ExtMotorRequest')
const RawMotorRequest = require('./lib/motor/ExtMotorRequest')
const PoppyRequestHandler = require('./lib/utils/PoppyRequestHandler')

const Script = require('./lib/script/Script')

// ///////////////////////////////
// Main object factories
// ///////////////////////////////

/**
 * Factory which creates the main module object: the Poppy one.
 * As the Poppy object is both in charge of the connection to the Poppy and
 * it handles the robot configuration, this factory allows modifying
 * the settings for these properties.
 * Note instantitating a poppy object without any settings will use ones
 * by default _i.e._ for a poppy ergo jr,
 * @param {object=} config - settings object
 * @param {module:poppy-robot-core~DescriptorLocator=} config.descriptor - Descriptor locator (for advanced users only)
 * @param {module:poppy-robot-core~ConnectionSettings=} config.connect - Connection Settings to Poppy
 * @type {module:poppy-robot-core~Poppy}
 * @static
 * @see {@link module:poppy-robot-core~Poppy}
 *
 * @example
 * const P = require('poppy-robot-core')
 *
 * let poppy = P.createPoppy() // create a poppy object
 *                             // using default settings for a Poppy Ergo Jr.
 *
 * let anotherPoppy = P.createPoppy({ // Another Poppy Ergo Jr...
 *   connect : { // ...with custom connection settings:
 *     ip: 'poppy1.local' // hostname set to poppy1.local
 *     httpPort: 8081   // and http server on port 8081
 *   }
 * })
 */
const createPoppy = (config) => {
  let poppy
  try {
    poppy = new Poppy(config)
  } catch (error) {
    console.log('Unable to create Poppy object:')
    console.log(error.message)
    process.exit(-1) // without any poppy instance, nothing is possible
  }

  return poppy
}

/**
 * Convinient factory in order to create a new Poppy Script Object.
 * It optionally allows selecting a bunch of motor (identified by their names) or
 * all motors to apply to next actions until call to the select method, if any.
 *
 * @param {...string=} motorId - the motor id/name or 'all' to select all motors
 * @type {module:poppy-robot-core~Script}
 * @static
 * @see {@link module:poppy-robot-core~Script}
 * @example
 * const P = require('poppy-robot-core')
 *
 * // Instantiate a new script and automatically target all motors
 * let myScript = P.createScript('all')
 *
 * // It is equivalent to
 * let myOtherScript = P.createScript()
 *   .select('all')
 *
 * // Create another script selecting only motor 'm1' and 'm2'
 * let anotherScript = P.createScript('m1','m2')
 *
 */
const createScript = (...motorIds) => new Script(...motorIds)

// ////////////////////////////////
// Main object factories
// ////////////////////////////////

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  createScript,
  createPoppy,
  Script,
  Poppy,
  ExtMotorRequest,
  RawMotorRequest,
  PoppyRequestHandler
}
