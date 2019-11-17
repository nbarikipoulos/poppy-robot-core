/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

/**
 * The Axios client class.
 * @external Axios
 * @see https://github.com/axios/axios
 */

/**
 * Connection Settings to Poppy Robot.
 *
 * @typedef ConnectionSettings
 * @type Object
 * @property {string} [ip=poppy.local] - hostname/ip of the targeted Poppy robot
 * @property {int} [httpPort=8080] - port of the http port served by the Poppy robot
 * @property {int} [snapPort=6969] - port of the snap port served by the Poppy robot (used for led)
 * @property {int} [timeout=1000] - request timeout (in ms)
 * @memberof module:poppy-robot-core
 * @inner
 * @category Typedefs
 */

/**
 * Response object that handles result of requests to the pypot http server
 * embedded in poppy Robot.
 *
 * This object is composed of properties with names and values
 * respectively set with the register name and the returned value.
 * More details available [here](https://github.com/poppy-project/pypot/blob/master/REST-APIs.md)
 * about the REST API of the pypot http server.
 *
 * @typedef ResponseObject
 * @type Object
 * @property {string|integer|boolean} `$registerName` - a property set to the queried register.
 * @memberof module:poppy-robot-core
 * @inner
 * @category Typedefs
 */

const axios = require('axios')

/**
 * Class in charge of the requests to the Poppy Robot.
 *
 * It allows requesting the rest APIs exposed by both http and snap server
 * served by the Poppy robot.
 * @memberof module:poppy-robot-core
 * @inner
 */
class PoppyRequestHandler {
  /**
   * Instantiate a new Poppy Request Handler.
   *
   * Default instantiation will use the default poppy ergo jr connection
   * settings.
   *
   * @param {module:poppy-robot-core~ConnectionSettings=} connect - connection settings
   * @example
   *  const ReqHandler = require('poppy-robot-core').PoppyRequestHandler
   *
   *  let req = new ReqHandler() // Default settings _i.e._ a Poppy Ergo Jr
   *  // with hostname and http port respectively set to 'poppy.local' and 8080.
   *
   *  req = reg.setMotorRegister('m1', 'moving_speed', '100') // will
   *  // set the 'moving_speed' register of motor 'm1' to 100.
   *
   *  //...
   *
   *  req.getMotorRegister('m1', 'present_position') // will return
   *  // a promise with result as:
   *  // {'present_position': 15}
   */
  constructor ({
    ip = 'poppy.local',
    httpPort = 8080,
    snapPort = 6969,
    timeout = 1000
  } = {}) {
    // Store the connection settings
    this._settings = Object.assign({},
      { ip, httpPort, snapPort, timeout }
    )

    // Initialize the base URLs for both pypot http server and snap (for led purpose)

    this._http = axios.create({
      baseURL: `http://${ip}:${httpPort}`,
      responseType: 'json',
      timeout
    })

    this._snap = axios.create({
      baseURL: `http://${ip}:${snapPort}`,
      responseType: 'json',
      timeout
    })
  }

  /**
   * Return an object including the connection settings
   * @return {module:poppy-robot-core~ConnectionSettings}
   */
  getSettings () {
    return this._settings
  }

  /**
   * Return the axios client for either http or snap rest api served
   * by the robot.
   * @param {'http'|'snap'=} [type='http'] - Client selector
   * @return {external:Axios}
   */
  client (type = 'http') {
    let client

    switch (type) {
      case 'snap':
        client = this._snap
        break
      case 'http':
      default:
        client = this._http
    }

    return client
  }

  /**
   * Set a register of a given motor with a value.
   *
   * Not it must not be used for the led registry
   * (see dedicated method.)
   * @param {string} motorName  - motor name/id
   * @param {string} registerName  - register name
   * @param {string} data - **data as string**
   * @return {Promise.<null>}
   */
  async setMotorRegister (motorName, registerName, data) { // FIXME TO RENAME
    return this.client().post(
      `/motor/${motorName}/register/${registerName}/value.json`,
      data
    )
  }

  /**
   * Get value of a given register for a given motor.
   * @param {string} motorName  - motor name/id
   * @param {string} registerName  - register name
   * @return {Promise.<module:poppy-robot-core~ResponseObject>}
   * @example
   *  const ReqHandler = require('poppy-robot-core').PoppyRequestHandler
   *
   *  let req = new ReqHandler()
   *
   *  req.getMotorRegister('m1', 'present_position')
   *  // will return
   *  // a promise with result as:
   *  // {'present_position': 15}
   */
  async getMotorRegister (motorName, registerName) { // FIXME TO RENAME
    const result = await this.client().get(
      `/motor/${motorName}/register/${registerName}`
    )
    return result.data
  }

  /**
   * Get the aliases of the Poppy Robot.
   *
   * Return an array containing the alias name/ids.
   * @return {Promise.<Array.<string>>}
   */
  async getAliases () {
    const result = await this.client().get(
      '/motor/alias/list.json'
    )
    return result.data
  }

  /**
   * Get the motor of a given alias.
   *
   * Return an array that contains the motor name/ids.
   * @param {string} alias  - alias name/id
   * @return {Promise.<Array.<string>>}
  */
  async getAliasMotors (alias) {
    const result = await this.client().get(
      `/motor/${alias}/list.json`
    )
    return result.data
  }
}

// /////////////////////////
// Hack for led which only works using the SNAP rest api.
// Led set is done through a GET method as below:
// http://poppy.local:6969/motors/set/registers/m2:led:off
// ////////////////////////////////

/**
 * Set the led register of a target motor
 * @memberof PoppyRequestHandler
 * @param {string} motor_name - motor name/id
 * @param {'off'|'red'|'green'|'blue'|'yellow'|'cyan'|'pink'|'white'} color  - register name
 * @return {Promise.<null>}
 */
PoppyRequestHandler.prototype.led = async function (motorName, color) {
  return this.client('snap').get(
    `/motors/set/registers/${motorName}:led:${color}`
  )
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = PoppyRequestHandler
