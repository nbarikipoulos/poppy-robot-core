'use strict'

const RawMotorRequest = require('./RawMotorRequest')
const { chainPromises, wait } = require('../../util/misc')

/**
 * Object representing a Poppy Motor that handles both low-level and
 * high-level actions on Poppy motor.
 *
 * @extends module:poppy-robot-core~RawMotorRequest
 * @memberof module:poppy-robot-core
 * @inner
 */
class ExtMotorRequest extends RawMotorRequest {
  /**
   * Set the 'moving_speed' register.
   * @param {integer} value - the speed value. It should be included into
   *    the [0,1023] range (speed is more or less 0.666 degree.s-1 per unit)
   *    Note using 0 set the speed to the highest possible value.
   * @return {Promise.<null>}
  */
  setSpeed (speed) {
    return this.set(
      'moving_speed',
      speed
    )
  }

  /**
   * Set the 'compliant' register.
   * @param {boolean} value - true/false for compliant/stiff state.
   * @return {Promise.<null>}
  */
  setCompliant (value) {
    return this.set(
      'compliant',
      value
    )
  }

  /**
   * Set the 'led' register.
   * @param {'off'|'red'|'green'|'blue'|'yellow'|'cyan'|'pink'|'white'} color - Led color value
   */
  setLed (color) {
    return this.set(
      'led',
      color
    )
  }

  /**
   * Set the 'goal_position' register to value.
   * @param {integer} value - the angle to reach in degree
   * @param {boolean=} [wait=false] - wait until the motor reachs the target position
   * @return {Promise.<null>}
  */
  async setPosition (value, wait = false) {
    let promise

    if (wait) {
      const duration = await this.computeDuration({
        end: value
      })
      promise = this.goto(value, duration, true)
    } else {
      promise = this.set('goal_position', value)
    }

    return promise
  }

  /**
   * Rotate the motor by x degrees.
   * @param {integer} value - the rotation value, in degrees
   * @param {number=} [duration] - duration of the movemement (in s)
   * @param {boolean=} [wait=false] - wait until the motor ends its rotation
   * @return {Promise.<null>}
  */
  async rotate (value, duration, wait = false) {
    const hasDuration = typeof duration === 'number' && !isNaN(duration)
    const _wait = hasDuration ? wait : duration

    const current = await this.getRegisterValue('goal_position') // 'present_position' ??
    const goal = current + Number.parseFloat(value)

    return hasDuration
      ? this.goto(goal, duration, _wait)
      : this.setPosition(goal, _wait)
  }

  /**
   * Move motor to a given postion setting the duration of the movement.
   *
   * Note the speed register of the motor could change if 'wait' is set to 'false'.
   * @param {integer} position - the position to reach in degree
   * @param {number} duration - duration of the movemement (in s)
   * @param {boolean=} [wait=false] - wait until the motor reachs the target position
   * @return {Promise.<null>}
  */
  async goto (position, duration, wait = false) {
    const request = _ => this._reqHandler.post(
      `/motors/${this.name}/goto.json`,
      {
        position,
        duration: duration || 0.001,
        wait: false // true will 'block' http server on robot see (*)
      }
    )

    const pps = [request]

    if (wait) {
      const speed = await this.getRegisterValue('moving_speed')

      pps.push(
        _ => wait ? this.wait(duration) : Promise.resolve(null), // (*) simulate wait set to true
        _ => wait ? this.setSpeed(speed) : Promise.resolve(null) // set 'back' the speed register
      )
    }

    return chainPromises(pps)
  }

  /**
   * Convinient wait method
   * @param {number} value - wait delay (in s)
   * @return {Promise.<null>}
  */
  wait (value) {
    return wait(value)
  }

  /**
   * Compute expected movement duration between 2 angles (in s).
   * @param {object} data - Input data
   * @param {integer=} data.start - Start position. If not provided, it will be set to the current position from register
   * @param {integer} data.end - Target position
   * @param {integer=} data.speed - Speed. If not provided, it will be set with the value from register
   * @return {number}
   */
  async computeDuration ({ start, end, speed } = {}) {
    const _start = start ?? (await this.getRegisterValue('present_position'))
    const _speed = (
      speed ?? (await this.getRegisterValue('moving_speed'))
    ) || 1023 // 0 <=> 1023

    return Math.abs(_start - end) / (_speed * 0.666) // in s
  }
}

// ///////////////////////////////
// ///////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = ExtMotorRequest
