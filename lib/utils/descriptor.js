/*! Copyright (c) 2018 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

/**
 * A String to locate a Poppy descriptor whith a format inspired by the URI one: 'schema://path'
 * @typedef {string} DescriptorLocator
 * @property {('file'|'desc')} schema - 'file' to refer to a local descriptor
 *          'desc' to refer to an inner descriptor of the module
 * @property {string} path - 'file' case: absolute or relative path to a local descriptor file,
 *          'desc' case: id to an embedded descriptor (only poppy-ergo-jr is nowadays supported)
 *
 * @example
 * let locator = 'file://myPoppy.json' // locator to a local descriptor file  named myPoppy.json
 * let myOtherLocator = 'desc://poppy-ergo-jr' // locator to the (default) Poppy Ergo Jr descriptor
 * @memberof module:poppy-robot-core
 * @inner
 * @category Typedefs
 */

const fs = require('fs')

const descFolder = `${__dirname}/../../config/`

const DESCRIPTOR_DEFAULT = 'desc://poppy-ergo-jr'

const read = (descLocator = DESCRIPTOR_DEFAULT) => {
  let descriptorFile

  const [schema, locator] = descLocator.split('://')

  switch (schema) {
    case 'file':
      descriptorFile = locator
      break
    case 'desc':
      descriptorFile = `${descFolder}/${locator}.json`
      break
    default:
      // No valid descriptor locator
      throw new Error(
        `Invalid descriptor locator '${descLocator}'.\n` +
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
  read,
  DESCRIPTOR_DEFAULT
}
