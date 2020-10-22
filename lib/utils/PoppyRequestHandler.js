/*! Copyright (c) 2018-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

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

const { chainPromises } = require('../../util/misc')
const DEFAULT_SETTINGS = require('./default-settings')

/**
 * Class in charge of the requests to the Poppy Robot.
 *
 * It allows requesting the REST API exposed by the http server located on
 * the Robot.
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
   *  const connect = {
   *    ip: 'poppy.home',
   *    port: 8081
   *  }
   *
   *  let req = new ReqHandler(connect)
   *
   *  // set the 'moving_speed' register of the motor 'm1' to 100.
   *  reg.setRegister('m1', 'moving_speed', '100')
   *
   *  //...
   *
   *  // get current position of the motor 'm1'
   *  // will return a promise with result as: {'present_position': 15}
   *  req.getRegister('m1', 'present_position')
   */
  constructor (connect = {}) {
    // Store the connection settings
    this._settings = { ...DEFAULT_SETTINGS, ...connect }

    // Initialize config
    this._axiosConf = {
      baseURL: `http://${this._settings.ip}:${this._settings.port}`,
      headers: { 'content-type': 'application/json' },
      responseType: 'json',
      timeout: this._settings.timeout
    }
  }

  /**
   * Return the connection settings
   * @return {module:poppy-robot-core~ConnectionSettings}
   */
  getSettings () {
    return this._settings
  }

  /**
   * Convinient method performing request to the robot.
   * @param {string} url - relative or absolute url to REST API served by the http server.
   * @param {string=} [method='get'] - request method to be used when making the request
   * @param {Object=} config - extra axios client settings
   * @return {Promise.<Object>} - Axios Response schema object
   * @see https://github.com/axios/axios
   * @example
   *  const ReqHandler = require('poppy-robot-core').PoppyRequestHandler
   *
   *  const req = new ReqHandler({ ip: 'poppy.home' })
   *
   * // Get: get the list the registers of the motor 'm1'
   *  req.perform('/motor/m1/register/list.json').then(response => {
   *    const list = response.data
   *    // ...
   *  })
   *
   *  // Post request: set the 'compliant' register
   *  req.perform(
   *    '/motor/m1/register/compliant/value.json',
   *    { method: 'post', config: { data: 'false' } }
   *  ).catch(err => { console.log(err) })
   */
  async perform (url, {
    method = 'get',
    config = {}
  } = {}) {
    return axios({
      ...this._axiosConf,
      ...config,
      ...{ url, method }
    })
  }

  /**
   * Set the value of a register of a motor.
   *
   * @param {string} motorName  - motor name/id
   * @param {string} registerName  - register name
   * @param {*} value - value to post
   * @return {Promise.<Object>} - Axios Response schema object
   */
  async setRegister (motorName, registerName, value) {
    // check value to post
    const data = (!isNaN(parseFloat(value)) ^ !Number.isInteger(value))
      ? value // Everithing excepted float
      : Math.trunc(value) // float to integer

    return this.perform(
      `/motor/${motorName}/register/${registerName}/value.json`,
      {
        method: 'post',
        config: { data: JSON.stringify(data) }
      }
    )
  }

  /**
   * Get the value of register(s).
   * @param {string} motorName - motor name/id
   * @param {...string} registerNames - target register names
   * @return {Promise.<module:poppy-robot-core~ResponseObject>}
   * @example
   *  const ReqHandler = require('poppy-robot-core').PoppyRequestHandler
   *
   *  let req = new ReqHandler()
   *
   *  req.getRegister('m1', 'present_position', 'compliant')
   *  // will return a promise with resolved value as:
   *  // { present_position: 90, compliant: false }
   */
  async getRegister (motorName, ...registerNames) {
    const requests = registerNames.map(
      r => _ => this.perform(`/motor/${motorName}/register/${r}/list.json`).then(res => res.data)
    )

    return chainPromises(
      requests,
      (p, n) => ({ ...p, ...n }),
      {}
    )
  }

  /**
   * Get the aliases of the Poppy Robot.
   *
   * Return an array containing the alias name/ids.
   * @return {Promise.<Array.<string>>}
   */
  async getAliases () {
    const result = await this.perform('/motor/alias/list.json')
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
    const result = await this.perform(`/motor/${alias}/list.json`)
    return result.data
  }
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = PoppyRequestHandler
