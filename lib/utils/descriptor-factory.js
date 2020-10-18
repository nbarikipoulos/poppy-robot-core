/*! Copyright (c) 2018-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

/**
 * Poppy robot descriptor.
 *
 * It handles the "structure" of motors of the target Poppy.
 * it gathers data about:
 * - alias _i.e._ set of motors,
 * - motor: name/id as well as angle range.
 *
 * And other descriptive data.
 *
 * @typedef Descriptor
 * @type {Object}
 * @property {string=} description - a human readable text about this descriptor
 * @property {string} name - name/id of this descriptor
 * @property {Array.<{name: string, motors: Array<string>}>} aliases - list of aliases
 * @property {Array.<module:poppy-robot-core~MotorDescriptor>} motors - the motor "descriptors"
 * @memberof module:poppy-robot-core
 * @inner
 * @category Typedefs
 */

const RequestHandler = require('./PoppyRequestHandler')
const { promiseAll } = require('../../util/misc')

/**
 * Create a Poppy motor configuration object aka descriptor that contains:
 * - The list of motors,
 * - The name, id, model and angle range of each motors,
 * - At last the aliases _i.e._ set/group of motors
 *
 * @param {module:poppy-robot-core~ConnectionSettings=} connect - connection settings. If not provided, default {@link module:poppy-robot-core~ConnectionSettings} will be used
 * @return {Promise.<module:poppy-robot-core~Descriptor>}
 * @memberof module:poppy-robot-core
 * @static
 * @see {@link module:poppy-robot-core~DescriptorLocator}
 */
const createDescriptor = async (connect) => {
  const descriptor = await discoverDescriptor(connect)
  return descriptor
}

// ///////////////////////////////
// Utility function
// ///////////////////////////////

const discoverDescriptor = async (connect) => {
  const req = new RequestHandler(connect || {})

  let aliases, motors

  try {
    //
    // First of all, Request for aliases and their motorIds.
    //
    aliases = await req.getAliases()
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
    motors = await promiseAll(
      motorIds,
      async m => {
        const reg = await promiseAll(
          ['model', 'id', 'lower_limit', 'upper_limit'],
          async reg => req.getRegister(m, reg)
        )

        return Object.assign({ name: m }, ...reg)
      }
    )
  } catch (error) {
    throw new Error(`Unable to discover robot:\n${error}`)
  }

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
  createDescriptor
}
