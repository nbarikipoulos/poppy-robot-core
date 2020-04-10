/*! Copyright (c) 2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

/**
 * Connection Settings to Poppy Robot.
 *
 * @typedef ConnectionSettings
 * @type Object
 * @property {string} [ip=poppy.local] - hostname/ip of the targeted Poppy robot
 * @property {int} [port=8080] - port of the REST API served by the http server on robot
 * @property {int} [timeout=1000] - request timeout (in ms)
 * @memberof module:poppy-robot-core
 * @inner
 * @category Typedefs
 */

const DEFAULT_CONNECTION_SETTINGS = {
  ip: 'poppy.local',
  port: 8080,
  timeout: 1000
}

Object.freeze(DEFAULT_CONNECTION_SETTINGS)

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = DEFAULT_CONNECTION_SETTINGS
