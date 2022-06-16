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

const { DEFAULT_SETTINGS } = require('./settings')
const { chainPromises } = require('../../util/misc')

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
   * @param {module:poppy-robot-core~PoppyConfig=} config - connection settings
   * @example
   *  const { PoppyRequestHandler: ReqHandler } = require('poppy-robot-core')
   *
   *  let req = new ReqHandler()
   *
   *  // set the 'moving_speed' register of the motor 'm1' to 100.
   *  req.setRegister('m1', 'moving_speed', '100')
   *
   *  //...
   *
   *  // get current position of the motor 'm1'
   *  // will return a promise with result as: {'present_position': 15}
   *  req.getRegister('m1', 'present_position')
   */
  constructor (config = {}) {
    this._config = { ...DEFAULT_SETTINGS, ...config }

    const host = this._config.resolved ?? this._config.host

    // Initialize config
    this._axiosConf = {
      baseURL: `http://${host}:${this._config.port}`,
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      responseType: 'json',
      timeout: this._config.timeout
    }
  }

  /**
   * Return connection settings
   * @return {module:poppy-robot-core~PoppyConfig=}
  */
  get settings () { return this._config }

  /**
   * Method performing request to the robot api.
   * @param {string} url - relative or absolute url to REST API served by the http server.
   * @param {string} method - request method.
   * @param {Object=} config - extra axios client settings.
   * @return {Promise.<Object>} Axios Response schema object
   * @see https://github.com/axios/axios
   * @example
   *  const { PoppyRequestHandler: ReqHandler } = require('poppy-robot-core')
   *
   *  const req = new ReqHandler({ host: 'poppy.home' })
   *
   * // Get: get the list the registers of the motor 'm1'
   *  // aka perform a get request on http://poppy.local:8080/motor/m1/register/list.json
   *  req.perform('/motor/m1/register/list.json').then(response => {
   *    const list = response.data
   *    // ...
   *  })
   *
   *  // Post request: set the 'compliant' register to false aka stiff mode
   *  // aka perform a post request on http://poppy.local:8080/motor/m1/register/compliant/value.json
   *  req.perform(
   *    '/motor/m1/register/compliant/value.json',
   *    'post',
   *    { data: 'false' }
   *  )
    *
   *  // Override configuration to get logs served on http://poppy.local/api/raw_logs by poppy web server
   *  req.perform(
   *    '/api/raw_logs',
   *    'post',
   *    { baseURL: 'http://poppy.local', data: 'id=0' }
   *  )
   */
  perform (url, method, axiosConfig = {}) {
    return axios({
      ...this._axiosConf,
      ...axiosConfig,
      url,
      method
    }).catch(err => { throw new Error(`${method} ${url}: ${err.message}`) })
  }

  /**
   * Perform a get request
   * @param {string} url - relative url to the REST API.
   * @param {Object=} config - extra axios client settings
   * @return {Promise.<Object>} - Axios Response schema object
   * @see https://github.com/axios/axios
   */
  get (url, config) { return this.perform(url, 'get', config) }

  /**
   * Perform a post request
   * @param {string} url - relative url to the REST API.
   * @param {*} data - data to post
   * @param {Object=} config - extra axios client settings
   * @return {Promise.<Object>} - Axios Response schema object
   * @see https://github.com/axios/axios
   */
  post (url, data, config) { return this.perform(url, 'post', { data, ...config }) }

  /**
   * Set the value of a register of a motor.
   *
   * @param {string} motorName  - motor name/id
   * @param {string} registerName  - register name
   * @param {*} value - value to post
   * @return {Promise.<Object>} - Axios Response schema object
   */
  setRegister (motorName, registerName, value) {
    // check value to post
    const data = (!isNaN(parseFloat(value)) ^ !Number.isInteger(value))
      ? value // Everithing excepted float
      : Math.trunc(value) // float to integer

    return this.post(
      `/motors/${motorName}/registers/${registerName}/value.json`,
      JSON.stringify(data)
    )
  }

  /**
   * Get the value of register(s).
   * Note if a request for a register failed, its value will be set to undefined.
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
  getRegister (motorName, ...registerNames) {
    const requests = registerNames.map(
      r => _ => this.get(`/motors/${motorName}/registers/${r}/value.json`)
        .catch(_ => Promise.resolve({ data: { [r]: undefined } }))
        .then(response => response.data)
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
   * Return an array containing the alias names.
   * @return {Promise.<Array.<string>>}
   */
  async getAliases () {
    const response = await this.get('/motors/aliases/list.json')
    return response.data.aliases
  }

  /**
   * Get the motor of a given alias.
   *
   * Return an array that contains the motor names.
   * @param {string} alias  - alias name/id
   * @return {Promise.<Array.<string>>}
  */
  async getAliasMotors (alias) {
    const response = await this.get(`/motors/${alias}/list.json`)
    return response.data[alias]
  }
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = PoppyRequestHandler
