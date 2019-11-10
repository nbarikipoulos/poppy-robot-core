/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

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

/**
 * A String to locate a Poppy descriptor whith a format inspired by the URI one: 'schema://path'
 * @typedef {string} DescriptorLocator
 * @property {('file'|'desc')} schema - 'file' to refer to a local descriptor
 *          'desc' to refer to an inner descriptor of the module
 * @property {string} path - 'file' case: absolute or relative path to a local descriptor file,
 *          'desc' case:
 *            - 'live-discovering': live discovering of the Poppy,
 *            - id to an embedded descriptor (only poppy-ergo-jr is nowadays supported)
 *
 * @example
 * let locator = 'file://myPoppy.json' // locator to a local descriptor file named myPoppy.json
 * let myOtherLocator = 'desc://live-discovering' // locator indicating a live discovrering will be executed
 * @memberof module:poppy-robot-core
 * @inner
 * @category Typedefs
 */

const fs = require('fs')

const RequestHandler = require('./PoppyRequestHandler')
const promiseAll = require('../../util/misc').promiseAll

const LIVE_DISCOVERING = 'desc://live-discovering'

/**
 * (__async method__)
 * Create a Poppy motor configuration object aka descriptor that contains:
 * - The list of motors,
 * - The name and angle range of each motors,
 * - At last the aliases _i.e._ set/group of motors
 *
 * It allows creating a Descriptor:
 *  - Performing a live discovering from connected robot,
 *  - From either an internal or provided by user json file.
 *
 * The connect options are only used for live discovering.
 *
 * @param {module:poppy-robot-core~DescriptorLocator} descriptorLocator - The descriptor locator
 * @param {module:poppy-robot-core~ConnectionSettings=} connect - connection settings. If not provided, default {@link module:poppy-robot-core~ConnectionSettings} will be used
 * @return {Promise.<module:poppy-robot-core~Descriptor>}
 * @memberof module:poppy-robot-core
 * @static
 * @see {@link module:poppy-robot-core~DescriptorLocator}
 */
const createDescriptor = async (descriptorLocator, connect) => {
  const descriptor = descriptorLocator === LIVE_DISCOVERING
    ? await discoverDescriptor(connect)
    : readJSONDescriptor(descriptorLocator)
  return descriptor
}

// ///////////////////////////////
// Utility function
// ///////////////////////////////

const discoverDescriptor = async (connect) => {
  const req = new RequestHandler(connect || {})

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

const readJSONDescriptor = (descriptorLocator) => {
  let descriptorFile

  const [schema, locator] = descriptorLocator.split('://')

  switch (schema) {
    case 'file':
      descriptorFile = locator
      break
    case 'desc':
      descriptorFile = `${__dirname}/../../config/${locator}.json`
      break
    default:
      // No valid descriptor locator
      throw new Error(
        `Invalid descriptor locator '${descriptorLocator}'.\n` +
        'Allowed formats are \'file://filepath\' or \'desc://descriptorId\'.'
      )
  }

  let descriptor
  // Load the robot descriptor file
  try {
    descriptor = JSON.parse(
      fs.readFileSync(descriptorFile, 'utf8')
    )
  } catch (error) {
    throw new Error(
      `Unable to read/an error occurs reading the robot descriptor ${descriptorFile}`
    )
  }

  return descriptor
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = {
  DEFAULT_DESCRIPTOR: 'desc://poppy-ergo-jr',
  createDescriptor
}
