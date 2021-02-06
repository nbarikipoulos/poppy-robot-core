/*! Copyright (c) 2019-2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const Poppy = require('./Poppy')
const PoppyRequestHandler = require('./utils/PoppyRequestHandler')
const Script = require('./script/Script')

const descriptorFactory = require('./utils/descriptor-factory')
const { getSettings } = require('./utils/default-settings')

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
 * @return {Promise.<module:poppy-robot-core~Poppy>}
 * @static
 * @memberof module:poppy-robot-core
 * @see {@link module:poppy-robot-core~Poppy}
 *
 * @example
 * const { createPoppy } = require('poppy-robot-core')
 *
 * // create a poppy object using default connection settings
 * // aka poppy.local and 8080 as hostname and port
 * createPoppy().then(poppy => {
 *  ... // Nice stuff with my poppy
 * })
 *
 * // Another Poppy with custom connection settings
 * const connect = {
 *     hostname: 'poppy1.local' // hostname set to poppy1.local
 *     port: 8081   // and REST API served on port 8081
 * }
 * createPoppy({ connect }).then(poppy => {
 *  ... // Other nice stuff with this other poppy
 * })
 *
 */
const createPoppy = async ({
  connect = {}
} = {}) => {
  let poppy

  const settings = await getSettings(connect)

  try {
    const descriptor = await descriptorFactory.createDescriptor(settings)
    poppy = new Poppy(descriptor, settings)
  } catch (error) {
    throw new Error(`Unable to create Poppy object:\n${error}`)
  }

  return poppy
}

/**
 * Convinient factory in order to create PoppyRequestHandler.
 * Note it will first set-up missing values (hostname, port and timeout) and,
 * in a second hand, resolve the hostname.
 * @param {module:poppy-robot-core~ConnectionSettings=} connect - Connection Settings to Poppy
 * @return {Promise.<module:poppy-robot-core~PoppyRequestHandler>}
 * @static
 * @memberof module:poppy-robot-core
 * @see {@link module:poppy-robot-core~PoppyRequestHandler}
 * @example
 * const { createRequestHandler } = require('poppy-robot-core')
 *
 * // create a poppy request handler using default connection settings
 * // aka poppy.local and 8080 as hostname and port
 * createRequestHandler().then(reqHandler => {
 *  // Get compliant state of motor m1
 *  const speed = await reqHandler.get('/motor/m1/register/compliant/value.json')
 *  ...  // Nice other stuff
 * })
 *
 * // Another request handler to another poppy
 * const connect = {
 *     hostname: 'poppy1.local' // hostname set to poppy1.local
 *     port: 8081   // and REST API served on port 8081
 * }
 * createRequestHandler(connect).then(reqHandler => {
 *  // Set motor m1 state to stiff
 *  await reqHandler.post('/motor/m1/register/compliant/value.json', false)
 *  ...  // Nice other stuff
 * })
 */
const createRequestHandler = async (connect) => {
  const settings = await getSettings(connect)
  const reqHandler = new PoppyRequestHandler(settings)
  return reqHandler
}

/**
 * Convinient factory in order to create a new Poppy Script Object.
 * It optionally allows selecting a bunch of motor (identified by their names) or
 * all motors to apply to next actions until call to the select method, if any.
 * @param {...string=} [motorId=all] - the motor id/name or 'all' to select all motors
 * @return {module:poppy-robot-core~Script}
 * @static
 * @memberof module:poppy-robot-core
 * @see {@link module:poppy-robot-core~Script}
 * @example
 * const { createScript } = require('poppy-robot-core')
 *
 * // Create a new Script object and automatically target all motors
 * let myScript = createScript('all')
 *
 * // Note it is equivalent to
 * let myOtherScript = createScript()
 *   .select('all')
 *
 * // Create another script selecting only motor 'm1' and 'm2'
 * let anotherScript = createScript('m1','m2')
 *
 */
const createScript = (...motorIds) => new Script(...motorIds)

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = {
  createPoppy,
  createRequestHandler,
  createScript
}
