/*! Copyright (c) 2018-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const RawMotorRequest = require('./RawMotorRequest')

/**
 * Class representing a Poppy Motor which handles both low-level and
 * high-level actions on Poppy motor.
 *
 * @extends module:poppy-robot-core~RawMotorRequest
 * @memberof module:poppy-robot-core
 * @inner
 */
class ExtMotorRequest extends RawMotorRequest {
  /**
   * Set the speed (registry 'moving_speed') of the motor.
   *
   * @param {integer} value - the speed value. It should be included into
   *    the [0,1023] range (speed is more or less 0.666 degree.s-1 per unit)
   * @return {Promise.<null>}
  */
  async setSpeed (speed) {
    return this.set(
      'moving_speed',
      speed.toString()
    )
  }

  /**
   * Set the 'compliant' registry of the selected motor(s).
   * @param {boolean} value - __false__ for "drivable" state, __true__ for "rest" mode.
   * @return {Promise.<null>}
  */
  async setCompliant (value) {
    return this.set(
      'compliant',
      value.toString()
    )
  }

  /**
   * Set the target position (registry 'goal_position') of the selected motor(s).
   * @param {integer} value - the position to reach in degree
   * @param {boolean=} [wait=false] - wait until the motor reachs the target position
   * @return {Promise.<null>}
  */
  async setPosition (value, wait = false) {
    return !wait
      ? this.set(
        'goal_position',
        value.toString()
      )
      : this._waitGoTo(value)
  }

  /**
   * Rotate the selected motor(s) by x degrees.
   * @param {integer} value - the rotation value, in degrees
   * @param {boolean=} [wait=false] - wait until the motor ends its rotation
   * @return {Promise.<null>}
  */
  async rotate (value, wait = false) {
    const property = 'goal_position'
    const current = await this.get(property)
    const goal = current[property] + Number.parseFloat(value)

    return !wait
      ? this.set(
        property,
        goal.toString()
      )
      : this._waitGoTo(goal)
  }

  /**
   * Convinient wait method
   * @param {integer} value - wait delay (in ms)
   * @return {Promise.<null>}
  */
  async wait (value) {
    return _wait(undefined, value)
  }

  async _waitGoTo (targetValue) {
    const property = 'present_position'

    const currentPos = (await this.get(property))[property]
    const delta = currentPos - targetValue

    const speedReg = 'moving_speed'
    const speed = (await this.get(speedReg))[speedReg]

    const expectedDuration = 1000 * Math.abs(delta) / (speed * 0.666)
    const initialPeriod = 333

    const period = Math.max(expectedDuration / 3, initialPeriod)

    const sgn = Math.sign(delta)

    const checkValue = _ => _wait(0, period)
      .then(_ => this.get(property))
      .then(result => {
        const delta = result[property] - targetValue
        if (
          Math.abs(delta) < 3 ||
          sgn !== Math.sign(delta)
        ) {
          return Promise.reject(new Error('done')) // Rejected but done.
        }
      })

    const n = Math.max(3, Math.ceil(expectedDuration / period))
    const arr = Array(n).fill(checkValue)
    arr.unshift(_ => this.setPosition(targetValue))

    return arr.reduce(
      (acc, current) => acc.then(_ => current()),
      Promise.resolve(null)
    ).catch(err => {
      if (err.message === 'done') { // Rejected but done.
        // Do nothing
      } else { // Real error
        Promise.reject(err)
      }
    })
  }
}

// ///////////////////////////////
// Utility functions
// ///////////////////////////////

const _wait = (res, delay) => new Promise(resolve => setTimeout(resolve, delay | _DEFAULT_DELAY, res))

const _DEFAULT_DELAY = 50

// ///////////////////////////////
// ///////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = ExtMotorRequest
