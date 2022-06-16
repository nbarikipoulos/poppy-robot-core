'use strict'

const { lookUp } = require('../../util/misc')

/**
 * Poppy config object.
 *
 * @typedef PoppyConfig
 * @type Object
 * @property {string} [host=poppy.local] - hostname/ip of the targeted Poppy robot.
 * @property {string} resolved - Resolved ip of the targeted Poppy robot, if successful, otherwise set to the host value.
 * @property {int} [port=8080] - Port of the pypot REST API
 * @property {int} [timeout=500] - Request timeout (in ms)
 * @memberof module:poppy-robot-core
 * @inner
 * @category Typedefs
 */

const DEFAULT_SETTINGS = {
  host: 'poppy.local',
  port: 8080,
  timeout: 500
}

Object.freeze(DEFAULT_SETTINGS)

/**
 * Return fullfilled config object
 * First fill the missing properties with default values.
 * On a second hand, (try to) resolve hostname.
 * @param {module:poppy-robot-core~PoppyConfig=} config _ User's connection settings.
 * @return {Promise.<module:poppy-robot-core~PoppyConfig>}
 * @see {link module:poppy-robot-core~PoppyConfig}
 */
const getConfig = async (config = {}) => {
  const result = { ...DEFAULT_SETTINGS, ...config }

  const ip = await lookUp(result.host)
  result.resolved = ip ?? result.host

  return result
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = {
  getConfig,
  DEFAULT_SETTINGS
}
