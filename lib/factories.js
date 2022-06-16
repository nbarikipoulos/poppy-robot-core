'use strict'

const { Poppy, discoverDescriptor } = require('./poppy')
const { PoppyRequestHandler, getConfig } = require('./request')
const { Script } = require('./script')

/**
 * Factory that creates the main module object: the Poppy one.
 * Note It firstly discovers target robot structure using provided connection settings and then
 * instantiate a new Poppy Object.
 * Note instantitating a poppy object without any settings will use default one for a poppy ergo jr,
 * @param {module:poppy-robot-core~PoppyConfig=} config - Connection Settings to Poppy
 * @return {Promise.<module:poppy-robot-core~Poppy>}
 * @static
 * @memberof module:poppy-robot-core
 * @see {@link module:poppy-robot-core~Poppy}
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
 * const config = {
 *     host: 'poppy1.local' // hostname set to poppy1.local
 *     port: 8081   // and REST API served on port 8081
 * }
 * createPoppy(config).then(poppy => {
 *  ... // Other nice stuff with this other poppy
 * })
 *
 */
const createPoppy = async (config) => {
  let poppy

  const conf = await getConfig(config)

  try {
    const descriptor = await discoverDescriptor(conf)
    poppy = new Poppy(descriptor, conf)
  } catch (error) {
    throw new Error(`Unable to create Poppy object:\n${error}`)
  }

  return poppy
}

/**
 * Convinient factory in order to create PoppyRequestHandler.
 * Note it will first set-up missing values (hostname, port and timeout) and,
 * in a second hand, resolve the hostname.
 * @param {module:poppy-robot-core~PoppyConfig=} config - Connection Settings to Poppy
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
 *  const speed = await reqHandler.get('m1', 'compliant')
 *  ...  // Nice other stuff
 * })
 *
 * // Another request handler to another poppy
 * const config = {
 *     host: 'poppy1.local'
 *     port: 8081
 * }
 * createRequestHandler(config).then(reqHandler => {
 *  // Set motor m1 state to stiff
 *  await reqHandler.post('m1', 'compliant', false)
 *  ...  // Nice other stuff
 * })
 */
const createRequestHandler = async (config) => {
  const conf = await getConfig(config)
  const reqHandler = new PoppyRequestHandler(conf)
  return reqHandler
}

/**
 * Discover the target Poppy and create a descriptor object that contains:
 * - The list of motors,
 * - The name, id, model and angle range of each motors,
 * - At last the aliases _i.e._ set/group of motors
 *
 * @param {module:poppy-robot-core~PoppyConfig=} config - Connection settings
 * @return {Promise.<module:poppy-robot-core~Descriptor>}
 * @memberof module:poppy-robot-core
 * @static
 * @see {@link module:poppy-robot-core~DescriptorLocator}
 * @example
 * const { createDescriptor } = require('poppy-robot-core')
 *
 * // Discover the structure/configuration of a poppy using default connection settings
 * // aka poppy.local and 8080 as hostname and port
 * createDescriptor().then(descriptor => {
 *  console.log(descriptor)
 * })
 *
 * // Discover another poppy:
 * const config = {
 *     host: 'poppy1.local'
 *     port: 8081
 * }
 * createDescriptor(config).then(descriptor => {
 *  console.log(descriptor)
 * })
 */
const createDescriptor = async (config) => {
  const conf = await getConfig(config)
  return discoverDescriptor(conf)
}

/**
 * Convinient factory in order to create a new Poppy Script Object.
 * It optionally allows selecting a bunch of motor (identified by their names) or
 * all motors to apply to next actions until call to the select method, if any.
 * @param {...string=} [motorNames='all'] - the motor name(s) or 'all' to select all motors
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
 * // Below an example of script
 * let anotherScript = createScript('all')
 *   .select('all') // Select all motors...
 *   .stiff() // Make them programmatically "drivable"
 *   .position(0) // ... move all motors to position 'O' degree.
 *   . ...        // ... do other nice stuffs (always on all motors)
 *   .select('m1','m2') // Next select only the motors 'm1' and 'm2'...
 *   .rotate(30) // and apply them a rotation by +30 degrees.
 *
 */
const createScript = (...motorNames) => new Script(...motorNames)

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = {
  createPoppy,
  createScript,
  createRequestHandler,
  createDescriptor
}
