/*! Copyright (c) 2020-2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { lookUp } = require('../../util/misc')

/**
 * Connection Settings to Poppy Robot.
 *
 * @typedef ConnectionSettings
 * @type Object
 * @property {string} [hostname=poppy.local] - hostname/ip of the targeted Poppy robot.
 * @property {string} resolved - Resolved ip of the targeted Poppy robot, if successful, otherwise set to hostname value.
 * @property {int} [port=8080] - port of the REST API served by the http server on robot
 * @property {int} [timeout=500] - request timeout (in ms)
 * @memberof module:poppy-robot-core
 * @inner
 * @category Typedefs
 */

const DEFAULT_CONNECTION_SETTINGS = {
  hostname: 'poppy.local',
  port: 8080,
  timeout: 500
}

Object.freeze(DEFAULT_CONNECTION_SETTINGS)

/**
 * Return fullfilled connection object
 * First fill the missing properties of the connection object with default values.
 * On a second hand, it will resolve the hostname
 * @param {module:poppy-robot-core~ConnectionSettings=} connect _ User's connection settings.
 * @return {Promise.<module:poppy-robot-core~ConnectionSettings>}
 * @see {link module:poppy-robot-core~ConnectionSettings}
 */
const getSettings = async (connect) => {
  const settings = { ...DEFAULT_CONNECTION_SETTINGS, ...connect }
  settings.resolved = await lookUp(settings.hostname)

  return settings
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = {
  DEFAULT_CONNECTION_SETTINGS,
  getSettings
}
