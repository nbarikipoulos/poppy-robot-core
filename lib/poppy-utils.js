/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const RequestHandler = require('./utils/PoppyRequestHandler')
const promiseAll = require('../util/misc').promiseAll

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
  discoverRobot
}
