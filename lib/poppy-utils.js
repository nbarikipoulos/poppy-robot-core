/*! Copyright (c) 2019-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const Poppy = require('./Poppy')
const Script = require('./script/Script')

const descriptorFactory = require('./utils/descriptor-factory')

const lookUp = require('../util/misc').lookUp

// ///////////////////////////////
// Main object factories
// ///////////////////////////////

/**
 * Factory that creates the main module object: the Poppy one.
 * Note It firstly discovers target robot structure using provided connection settings and then
 * instantiate a new Poppy Object.
 * Note instantitating a poppy object without any settings will use default one for a poppy ergo jr,
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
  connect = {},
  locator = descriptorFactory.DEFAULT_DESCRIPTOR
} = {}) => {
  let poppy

  connect.ip = await lookUp(connect.ip)

  try {
    const descriptor = await descriptorFactory.createDescriptor(locator, connect)
    poppy = new Poppy(descriptor, connect)
  } catch (error) {
    throw new Error(`Unable to create Poppy object:\n${error}`)
  }

  return poppy
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
