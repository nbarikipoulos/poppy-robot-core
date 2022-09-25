'use strict'

/**
 * This object allows defining a set of actions to apply to target motors.
 * It allows selecting targeted motors, and then applying them a set of actions.
 *
 * Once instantiated, Script objects own a bunch of methods in oder to:
 * - select target motors,
 * - perform some actions,
 * - and other basic stuff such as waiting.
 *
 * Note contrary to the CLI mode, __no controls are performed on input values of
 * these methods and then, it is easy to corrupt motor registries__.
 * Such state will require a reboot of the robot.
 * @memberof module:poppy-robot-core
 * @inner
 * @example
 * const { Script } = require('poppy-robot-core')
 *
 * let script = new Script('all') // Select all motors
 *   .speed(100) // Set all motor speed to 100
 *   .stiff() // Make them programmatically "drivable"
 *   .goto(0) // Move all motors to 0 degree.
 *
 * let myOtherScript = new Script('m1', 'm3') // Only select the 'm1' and 'm2' motors
 *   .rotate(30) // rotate 'm1' and 'm3' by 30 degrees.
 *   .select('m4') // select the 'm4' motor for next action
 *   .rotate(20) // Rotate 'm4' by 20 degrees
 */
class Script {
  /**
   * Create a new Script Object.
   *
   * It could optionally set the targeted motor for the next actions of
   * this script.
   * @param {string} motorNames  - the motor name(s) or 'all' to select all motors
   */
  constructor (...motorNames) {
    this._actionHandlers = [].concat(
      new ActionHandler(motorNames) // append a default ActionHandlers to this script
    )
  }

  /**
   * Select the target motor(s) for the next script actions.
   * It will define the targeted motor(s) until the next __select__ action, if any.
   * @param {...string} motorNames - the name(s) of the selected motor or 'all' to select all motors
   * @return {module:poppy-robot-core~Script}
   * @example
   * let script = new Script('all')
   *    .select('all') // Select all motors...
   *    .stiff() // Make them programmatically "drivable"
   *    . ...
   *    .select('m1','m2') // Next select only the motors 'm1' and 'm2'...
   *    .rotate(30) // and apply them a rotation by +30 degrees.
  */
  select (...motorNames) {
    const current = this._getCurrentActionHandler()
    if (!current.hasMotorSet()) { // Set the current action handler if it has no motor names...
      current.motors = motorNames
    } else { // ... Or create new one.
      this._actionHandlers.push(
        new ActionHandler(motorNames)
      )
    }

    return this
  }

  /**
   * Set the led value of the target motor(s).
   * @param {('off'|'red'|'green'|'blue'|'yellow'|'cyan'|'pink')} value - value for the 'led' register
   * @return {module:poppy-robot-core~Script}
   * @example
   * let script = new Script('all')
   *    .led('blue') // will set the led color to blue
  */
  led (value) {
    this._addAction('setLed', { led: value })
    return this
  }

  /**
   * @param {integer} value - the position to reach in degree
   * @param {boolean=} [wait=false] - wait until motors reach their target positions
   * @return {module:poppy-robot-core~Script}
   * @deprecated
   * @see {@link module:poppy-robot-core~Script#goto}
  */
  position (value, wait = false) {
    return this.goto(value, wait)
  }

  /**
   * Set the target position (register 'goal_position') of the selected motor(s).
   *
   * It will create an action that will move the selected motor(s) to the given position.
   * @param {integer} value - the position to reach in degree
   * @param {number=} duration - set the movement duration duration (in s)
   * @param {boolean=} [wait=false] - wait until motors reach their target positions.
   * @return {module:poppy-robot-core~Script}
   * @example
   * let script = new Script('m6')
   *    .goto(90) // Send a request in order to "open" the grip.
   *                  // It does not wait the end of this movement
   *                  // and next instructions will be send in the wake of it
   *    .select('m1')
   *    .goto(150, 2.5) // move the motor 'm1' to 150 degrees in 2.5s
   *    .select('m2', 'm3', 'm4')
   *    .goto(0, true) // Send a instruction to move all selected motors to 0
   *                   // awaiting the end of the movement.
  */
  goto (value, duration, wait = false) {
    const param = _toParameters(
      { positions: value },
      duration,
      wait
    )

    this._addAction('move', param)

    return this
  }

  /**
   * Create an action to rotate the selected motor(s) by x degrees.
   * @param {integer} value - the rotation value, in degrees
   * @param {number=} duration - set the movement duration duration (in s)
   * @param {boolean=} [wait=false] - wait until the selected motors will end
   *   their rotations before executing the next action
   * @return {module:poppy-robot-core~Script}
   * @example
   * let script = new Script('m1', 'm5')
   *    .rotate(-30) // Send instruction to rotate by -30 degrees the selected motors.
   *                 // It does not wait the end of this movement
   *                 // and next instructions will be send in the wake of it
   *    .select('m6')
   *    .rotate(60, true) // Send an instruction in order to rotate
   *                      // the motor 'm6' by 60 degrees and await the end of the movement
   *    .select('m6')
   *    .rotate(-60, 3, true) // perform rotation by -60 degrees in 3s
   */
  rotate (value, duration, wait = false) {
    const param = _toParameters(
      { angles: value },
      duration,
      wait
    )

    this._addAction('rotate', param)

    return this
  }

  /**
   * Set the speed (register 'moving_speed') of the selected motor(s).
   * @param {integer} value - the speed value. It should be included into
   *    the [0,1023] range (speed is more or less 0.666 degree.s-1 per unit).
   *    Note using 0 set the speed to the highest possible value.
   * @return {module:poppy-robot-core~Script}
   * @example
   * let script = new Script('all')
   *    .speed(100) // Set the speed of all motor to 100
  */
  speed (value) {
    this._addAction('setSpeed', { speed: value })
    return this
  }

  /**
   * "Release" selected motor(s) _i.e._ make them movable by hand _i.e._ set their 'compliant' register to 'true'.
   * @return {module:poppy-robot-core~Script}
   * @example
   * let endScript = new Script('all')
   *    .compliant()
  */
  compliant () {
    this._compliant(true)
    return this
  }

  /**
   * "Handle" programmatically selected motor(s) _i.e._ set their 'compliant' register to 'false'.
   * @return {module:poppy-robot-core~Script}
   * @example
   * let script = new Script('all')
   *    .stiff()
  */
  stiff () {
    this._compliant(false)
    return this
  }

  _compliant (value) {
    this._addAction('setCompliant', { compliant: value })
  }

  /**
   * The wait method. It allows to stop the script execution during a given
   * delay.
   * @param {number} value - wait delay (in s)
   * @return {module:poppy-robot-core~Script}
   * @example
   * let script = new Script()
   *    .select('m2')
   *    .goto(-90) // we do not wait the end of movement
   *    .wait(1) // Wait 1 second before executing the next action
   *    .select('m3')
   *    .goto(90)
  */
  wait (value) {
    this._addAction('wait', { wait: value })
    return this
  }

  /** @private */
  _addAction (id, param) {
    const currentElement = this._getCurrentActionHandler()
    currentElement.addAction(id, param)
  }

  /** @private */
  _getCurrentActionHandler () {
    return this._actionHandlers[
      this._actionHandlers.length - 1
    ]
  }
}

/** @private */
class ActionHandler {
  constructor (motorNames) {
    this.motors = motorNames
    this._actions = []
  }

  hasMotorSet () { return this.motors.length !== 0 }

  get motors () { return this._motorNames }
  set motors (motorNames) {
    this._motorNames = motorNames.includes('all')
      ? 'all'
      : motorNames
  }

  get actions () { return this._actions }

  addAction (id, param) {
    this._actions.push({ id, param })
  }
}

// ////////////////////////////////
// ////////////////////////////////
// Utility functions
// ////////////////////////////////
// ////////////////////////////////

const _toParameters = (value, duration, wait) => {
  const hasDuration = typeof duration === 'number'
  const wait_ = hasDuration ? wait : duration

  const duration_ = hasDuration ? { duration } : undefined

  return {
    ...value,
    ...duration_,
    wait: wait_
  }
}

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = Script
