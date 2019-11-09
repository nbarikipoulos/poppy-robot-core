/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const Poppy = require('./Poppy')
const Script = require('./script/Script')
const RequestHandler = require('./utils/PoppyRequestHandler')
const readDescriptor = require('./utils/descriptor').read

const promiseAll = require('../util/misc').promiseAll

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
 * @type {module:poppy-robot-core~Poppy}
 * @static
 * @see {@link module:poppy-robot-core~Poppy}
 *
 * @example
 * const P = require('poppy-robot-core')
 *
 * const poppy = P.createPoppy() // create a poppy object
 *                             // using default settings for a Poppy Ergo Jr.
 *
 * const anotherPoppy = P.createPoppy({ // Another Poppy Ergo Jr...
 *   connect : { // ...with custom connection settings:
 *     ip: 'poppy1.local' // hostname set to poppy1.local
 *     httpPort: 8081   // and http server on port 8081
 *   }
 * })
 */
const createPoppy = ({
  connect,
  locator
} = {}) => {
  let poppy

  try {
    const descriptor = readDescriptor(locator)
    poppy = new Poppy(descriptor, connect)
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

/**
 * Discover Poppy motor configuration aka:
 * - The list of motors,
 * - The name and angle range of each motors,
 * - At last the aliases _i.e._ set/group of motors
 *
 * Note the use of default settings will use default connection for a poppy ergo jr aka
 * ip/hostname, http and snap ports respectively set to 'poppy.local', 8080 and 6969
 *
 * @param {module:poppy-robot-core~ConnectionSettings=} connect - connection settings
 * @return {module:poppy-robot-core~Descriptor}
 * @memberof module:poppy-robot-core
 * @static
 * @see {@link module:poppy-robot-core~ConnectionSettings}
 * @see {@link module:poppy-robot-core~Descriptor}
 */
const discoverRobot = async (connect) => {
  const req = new RequestHandler(connect)

  //
  // First of all, Request for aliases and their motorIds.
  //

  const aliases = await req.getAliases()
    .then(aliases => promiseAll(
      aliases.alias,
      async a => {
        const motors = (await req.getAliasMotors(a)).alias
        return { name: a, motors }
      }
    ))

  //
  // Then, let's obtains motors data (lower and upper limits for angle)
  //

  // Gather all motor ids here
  const motorIds = aliases.reduce(
    (acc, elt) => acc.concat(elt.motors), []
  )

  // And then, get all data
  const motors = await promiseAll(
    motorIds,
    async m => {
      const reg = await promiseAll(
        ['lower_limit', 'upper_limit'],
        async reg => req.getMotorRegister(m, reg)
      )

      return Object.assign({ name: m }, ...reg)
    }
  )

  // At last the descriptor object
  const descriptor = {
    description: `Robot lively discovered from ${connect.ip}`,
    name: `${connect.ip}`,
    aliases,
    motors
  }

  return descriptor
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = {
  createScript,
  createPoppy,
  discoverRobot
}
