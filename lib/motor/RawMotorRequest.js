'use strict'

/**
 * Motor Descriptor.
 *
 * @typedef MotorDescriptor
 * @type Object
 * @property {string} name - name/id of the motor
 * @property {string} model - model of the motor
 * @property {int} lower_limit - lower angle boundary of the motor
 * @property {int} upper_limit - upper angle boundary of the motor
 * @memberof module:poppy-robot-core
 * @inner
 * @category Typedefs
 */

/**
 * Class that handles the primary requests to a Poppy motor _i.e._ access to the registers of the motor.
 *
 * @see {@link module:poppy-robot-core~PoppyRequestHandler}
 * @memberof module:poppy-robot-core
 * @inner
 */
class RawMotorRequest {
  /**
   * Create a new raw motor object.
   * @param {module:poppy-robot-core~MotorDescriptor} - motor descriptor
   * @param {module:poppy-robot-core~PoppyRequestHandler} requestHandler - Poppy request handler object
   * @example
   * const {RawMotorRequest: Motor, PoppyRequestHandler: RequestHandler} = require('poppy-robot-core')
   *
   * let motor = new Motor(
   *   { name: 'm1', lower_limit: -90, upper_limit: 90},
   *   new RequestHandler() // default setting to Poppy Ergo Jr
   * )
   *
   * motor.set('moving_speed', '100') // Will set the speed to 100,
   *
   * //...
   *
   * motor.get('moving_speed', 'compliant') // Will return a promise with result as
   * // {
   * //   moving_speed: 100
   * //   compliant: true
   * // }
  */
  constructor (motor, requestHandler) {
    this._motor = motor
    this._reqHandler = requestHandler
  }

  /**
   * Return the motor name/id.
   * @return {string}
  */
  get name () {
    return this._motor.name
  }

  /**
   * Set a register of the motor to a given value.
   * @param {string} registerName  - register name
   * @param {string|integer|boolean} data - data
   * @return {Promise.<null>}
  */
  set (registerName, data) {
    return this._reqHandler.setRegister(
      this._motor.name,
      registerName,
      data
    )
  }

  /**
   * Return the value(s) of register(s) as an object.
   * @param {...string} registerNames  - target register names
   * @return {Promise.<module:poppy-robot-core~ResponseObject>}
   * @example
   * const {RawMotorRequest: Motor, PoppyRequestHandler: RequestHandler } = require('poppy-robot-core')
   *
   * let motor = new Motor(
   *  { name: 'm1', lower_limit: -90, upper_limit: 90},
   *  new RequestHandler() // default setting to Poppy Ergo Jr
   * })
   *
   * motor.get('present_position', 'goal_position')
   * // Will return a promise with result as
   * // {
   * //   present_position: 10,
   * //   goal_position: 80
   * // }
  */
  get (...registerNames) {
    return this._reqHandler.getRegister(
      this._motor.name,
      ...registerNames
    )
  }

  /**
   * Return the value of a register as a primitive type.
   * @param {...string} registerNames  - target register names
   * @return {Promise.<string|integer|boolean>}
  */
  async getRegisterValue (registerName) {
    return (await this.get(registerName))[registerName]
  }
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = RawMotorRequest
