/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const Poppy = require('./Poppy')
const Script = require('./script/Script')

const descriptorFactory = require('./utils/descriptor-factory')

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
 * @param {module:poppy-robot-core~ConnectionSettings=} config.connect - Connection Settings to Poppy
 * @param {module:poppy-robot-core~DescriptorLocator=} config.locator - Descriptor locator (for advanced users only)
 * @return {Promise.<module:poppy-robot-core~Poppy>}
 * @static
 * @memberof module:poppy-robot-core
 * @see {@link module:poppy-robot-core~Poppy}
 *
 * @example
 * const P = require('poppy-robot-core')
 *
 * // create a poppy object using live discovering
 * // using default connection settings aka poppy.local and port 8080
 * P.createPoppy().then(poppy => {
 *  ... // Nice stuff with my poppy
 * })
 *
 * // Another Poppy with custom connection settings
 * const connect = {
 *     ip: 'poppy1.local' // hostname set to poppy1.local
 *     httpPort: 8081   // and http server on port 8081
 * }
 * P.createPoppy({connect}).then(poppy => {
 *  ... // Other nice stuff with this other poppy
 * })
 *
 */
const createPoppy = async ({
  connect,
  locator = descriptorFactory.DEFAULT_DESCRIPTOR
} = {}) => {
  const descriptor = await descriptorFactory.createDescriptor(locator, connect)

  return new Poppy(descriptor, connect)
}

/**
 * Convinient factory in order to create a new Poppy Script Object.
 * It optionally allows selecting a bunch of motor (identified by their names) or
 * all motors to apply to next actions until call to the select method, if any.
 *
 * @param {...string=} motorId - the motor id/name or 'all' to select all motors
 * @return {module:poppy-robot-core~Script}
 * @static
 * @memberof module:poppy-robot-core
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

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = {
  createScript,
  createPoppy
}
