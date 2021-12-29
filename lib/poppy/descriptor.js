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
 * @property {Array.<{name: string, motors: Array<string>}>} aliases - Array of aliases and their motors
 * @property {Array.<module:poppy-robot-core~MotorDescriptor>} motors - Array of motor descriptors
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
 * @param {module:poppy-robot-core~PoppyConfig=} config - Connection settings
 * @return {Promise.<module:poppy-robot-core~Descriptor>}
 * @memberof module:poppy-robot-core
 * @static
 * @see {@link module:poppy-robot-core~DescriptorLocator}
 */
const discoverDescriptor = async (config = {}) => {
  const req = new RequestHandler(config)

  let aliases, motors

  try {
    // first let get aliases and their motor names
    aliases = await _aliases(req)
    // Then, let's obtains motors data (lower and upper limits for angle)
    motors = await _motors(
      req,
      aliases.map(alias => alias.motors).flat() // aka motor names
    )
  } catch (error) {
    throw new Error(`Unable to discover robot:\n${error}`)
  }

  // At last, create the descriptor object
  const location = config.hostname

  const descriptor = {
    description: `Robot lively discovered from ${location}`,
    name: `${location}`,
    aliases,
    motors
  }

  return descriptor
}

// [{ name: alias, motors: [motorNames] }]
const _aliases = async (req) => {
  const aliasesNames = (await req.getAliases())

  const requests = aliasesNames.map(alias => async _ => {
    const motors = (await req.getAliasMotors(alias))
    return { name: alias, motors }
  })

  return chainPromises(requests)
}

// [MotorDescriptor]
const _motors = async (req, motors) => {
  const registers = ['model', 'id', 'lower_limit', 'upper_limit']

  const requests = motors.map(motor => async _ => {
    const data = await req.getRegister(motor, ...registers)
    return Object.assign({ name: motor }, data)
  })

  return chainPromises(requests)
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = { discoverDescriptor }
