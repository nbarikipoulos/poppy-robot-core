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
  setPosition (value, wait = false) {
    return !wait
      ? this.set('goal_position', value)
      : this._waitGoTo(value)
  }

  /**
   * Rotate the motor by x degrees.
   * @param {integer} value - the rotation value, in degrees
   * @param {boolean=} [wait=false] - wait until the motor ends its rotation
   * @return {Promise.<null>}
  */
  async rotate (value, wait = false) {
    const property = 'goal_position'
    const current = await this.getRegisterValue(property)
    const goal = current + Number.parseFloat(value)

    return !wait
      ? this.set(property, goal)
      : this._waitGoTo(goal)
  }

  /**
   * Convinient wait method
   * @param {integer} value - wait delay (in ms)
   * @return {Promise.<null>}
  */
  wait (value) {
    return wait(value)
  }

  async _waitGoTo (targetValue) {
    const f = async (reg) => this.getRegisterValue(reg)

    const currentPosition = await f('present_position')
    const delta = currentPosition - targetValue

    const speed = (await f('moving_speed')) || 1023

    const duration = Math.abs(delta) / (speed * 0.666) // s
    const timeout = Math.max(
      200, // min value
      1.1 * duration * 1000) // add 10% and convert to ms

    const goto = _ => this._reqHandler.post(
      `/motors/${this.name}/goto.json`,
      { position: targetValue, duration: duration || 0.001, wait: false },
      { timeout }
    )

    return chainPromises([
      goto,
      _ => this.setSpeed(speed),
      _ => wait(duration * 1000)
    ])
  }

  // async _waitGoTo (targetValue) {
  //   const f = async (reg) => (await this.get(reg))[reg]

  //   const currentPos = await f('present_position')
  //   const delta = currentPos - targetValue

  //   const speed = await f('moving_speed')

  //   const expectedDuration = 1000 * Math.abs(delta) / (speed * 0.666)
  //   const initialPeriod = 333
  //   const nIter0 = 10

  //   const period = Math.max(expectedDuration / nIter0, initialPeriod)
  //   const nIter = Math.max(nIter0, Math.ceil(expectedDuration / period))

  //   let duration = 0
  //   const sgn = Math.sign(delta)

  //   const checkValue = _ => f('present_position')
  //     .then(presentPosition => {
  //       const delta = presentPosition - targetValue
  //       if (
  //         Math.abs(delta) < 3 ||
  //         sgn !== Math.sign(delta) ||
  //         duration > expectedDuration
  //       ) {
  //         return Promise.reject(new Error('done')) // Rejected but done.
  //       }
  //     })
  //     .then(_ => {
  //       duration += period
  //       return _wait(0, period)
  //     })

  //   const arr = Array(nIter).fill(checkValue)
  //   arr.unshift(_ => this.setPosition(targetValue))

  //   return chainPromises(arr).catch(err => {
  //     if (err.message !== 'done') { // Real error
  //       return Promise.reject(err)
  //     }
  //   })
  // }
}

// ///////////////////////////////
// ///////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = ExtMotorRequest
