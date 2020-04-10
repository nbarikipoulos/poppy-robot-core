/*! Copyright (c) 2018-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const promiseAll = require('../../util/misc').promiseAll

/**
 * Motor Descriptor.
 *
 * @typedef MotorDescriptor
 * @type Object
 * @property {string} name - name/id of the motor
 * @property {int} lower_limit - lower angle boundary of the motor
 * @property {int} upper_limit - upper angle boundary of the motor
 * @memberof module:poppy-robot-core
 * @inner
 * @category Typedefs
 */

/**
 * Class that handles the primary requests to a Poppy motor _i.e._ the motor registry accesses.
 *
 * @see {@link module:poppy-robot-core~PoppyRequestHandler}
 * @memberof module:poppy-robot-core
 * @inner
 */
class RawMotorRequest {
  /**
   * Instantiate a new raw motor object.
   * @param {module:poppy-robot-core~MotorDescriptor} - motor descriptor
   * @param {module:poppy-robot-core~PoppyRequestHandler} requestHandler - Poppy request handler object
   * @example
   * const P = require('poppy-robot-core'),
   *  RawMotor = P.RawMotorRequest,
   *  ReqHandler = P.PoppyRequestHandler
   *
   * let motor = new RawMotor(
   *   { name: 'm1', lower_limit: -90, upper_limit: 90},
   *   new ReqHandler() // default setting to Poppy Ergo Jr
   * )
   *
   * motor.set('moving_speed', '100') // Will set the speed to 100,
   *
   * //...
   *
   * motor.get('moving_speed') // Will return a promise with result as
   * // {
   * //   moving_speed: 100
   * // }
  */
  constructor (motor, requestHandler) {
    this._motor = motor
    this._reqHandler = requestHandler
  }

  /**
   * Get the motor name/id.
   * @return {string}
  */
  getName () {
    return this._motor.name
  }

  /**
   * Set a register of the motor to a given value.
   *
   * Not it must not be used for the led registry
   * (see dedicated method.)
   * @param {string} registerName  - register name
   * @param {string} data - data as string
   * @return {Promise.<null>}
  */
  async set (registerName, data) {
    return this._reqHandler.setRegister(
      this._motor.name,
      registerName,
      data
    )
  }

  /**
   * Get value of target register(s).
   * @param {...string} registerNames  - target register names
   * @return {Promise.<module:poppy-robot-core~ResponseObject>}
   * @example
   * const P = require('poppy-robot-core'),
   *  RawMotor = P.RawMotorRequest,
   *  ReqHandler = P.PoppyRequestHandler
   *
   * let motor = new RawMotor(
   *  { name: 'm1', lower_limit: -90, upper_limit: 90},
   *  new ReqHandler() // default setting to Poppy Ergo Jr
   * })
   *
   * motor.get('present_position', 'goal_position')
   * // Will return a promise with result as
   * // {
   * //   present_position: 10,
   * //   goal_position: 80
   * // }
  */
  async get (...registerNames) {
    const results = await promiseAll(
      registerNames,
      reg => this._reqHandler.getRegister(
        this._motor.name, reg
      )
    )

    return Object.assign({}, ...results)
  }
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = RawMotorRequest
