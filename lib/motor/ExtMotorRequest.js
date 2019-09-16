/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

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
   * (__async method__)
   * Set the speed (registry 'moving_speed') of the motor.
   *
   * @param {integer} value - the speed value. It should be included into
   *    the [0,1023] range (speed is conversely to the value)
   * @return {Promise.<null>}
  */
  async setSpeed (speed) {
    return this.set(
      'moving_speed',
      speed.toString()
    )
  }

  /**
   * (__async method__)
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
   * (__async method__)
   * Set the target position (registry 'goal_position') of the selected motor(s).
   * @param {integer} value - the position to reach in degree
   * @param {boolean=} [value=false] - optionally wait that motor reachs the target position
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
   * (__async method__)
   * Rotate the selected motor(s) by x degrees.
   * @param {integer} value - the rotation value, in degrees
   * @param {boolean=} [wait=true] - optionally wait that motor will finish its rotation
   * @return {Promise.<null>}
  */
  async rotate (value, wait = true) {
    const property = 'present_position'
    const current = await this.get(property)
    const goal = current[property] + Number.parseFloat(value)

    return wait
      ? this._waitGoTo(goal)
      : this.set(
        'goal_position',
        goal.toString()
      )
  }

  /**
   * (__async method__)
   * Convinient wiat method
   * @param {integer} value - wait delay (in ms)
   * @return {Promise.<null>}
  */
  async wait (value) {
    return _wait(undefined, value)
  }

  async _waitGoTo (targetValue) {
    const property = 'present_position'

    let previousValue = 1000 // set to a dummy value

    const checkValue = _ => _wait(0, 100)
      .then(_ => this.get(property))
      .then(res => {
        const currentValue = res[property]
        if (
          Math.abs(currentValue - targetValue) < 1.7 ||
          Math.abs(currentValue - previousValue) < 0.5 // arf...
        ) {
          return Promise.reject('done') // Rejected but done.
        } else {
          previousValue = currentValue
        }
      })

    const n = 10 // FIXME...
    const arr = Array(n).fill(checkValue)
    arr.unshift(_ => this.setPosition(targetValue))

    return arr.reduce(
      (acc, current) => acc.then(_ => current()),
      Promise.resolve(null)
    ).catch(err => {
      if (err === 'done') { // Rejected but done.
        // Do nothing
        // console.log('==>', this._motor.name, 'done')
      } else {
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
