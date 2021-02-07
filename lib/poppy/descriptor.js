/*! Copyright (c) 2018-2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

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

const { PoppyRequestHandler: RequestHandler } = require('../request')
const { chainPromises } = require('../../util/misc')

/**
 * Discover the target Poppy and create a descriptor object that contains:
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
const discoverDescriptor = async (connect) => {
  const req = new RequestHandler(connect)

  let aliases, motors

  try {
    let requests
    // First of all, Requests to get aliases and their motors.
    const aliasesNames = (await req.getAliases()).alias

    requests = aliasesNames.map(alias => async _ => {
      const motors = (await req.getAliasMotors(alias)).alias
      return { name: alias, motors }
    })

    aliases = await chainPromises(requests)

    // Then, let's obtains motors data (lower and upper limits for angle)
    const registers = ['model', 'id', 'lower_limit', 'upper_limit']

    requests = aliases.map(a => a.motors)
      .flat()
      .map(m => async _ => {
        const data = await req.getRegister(m, ...registers)
        return Object.assign({ name: m }, data)
      })

    motors = await chainPromises(requests)
  } catch (error) {
    throw new Error(`Unable to discover robot:\n${error}`)
  }

  // At last the descriptor object
  const location = req.getSettings().hostname

  const descriptor = {
    description: `Robot lively discovered from ${location}`,
    name: `${location}`,
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

module.exports = { discoverDescriptor }
