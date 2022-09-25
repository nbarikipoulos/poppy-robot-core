'use strict'

const { ExtMotorRequest: Motor } = require('../motor')
const { PoppyRequestHandler: RequestHandler } = require('../request')
const { ScriptEngine } = require('../script')

const { chainPromises, wait: pWait } = require('../../util/misc')

/**
 * The main object of the module.
 * The poppy object handles:
 * - The robot descriptor aka the aliases and motors configuration,
 * - The object in charge of the requests to the robot,
 * - At last the script execution engine.
 *
 * @memberof module:poppy-robot-core
 * @inner
 * @example
 * const { Poppy, discoverDescriptor } = require('poppy-robot-core')
 *
 * const f = async _ => {
 *   //
 *   // create a poppy object using default connection settings
 *   //
 *   const descriptor = await discoverDescriptor()
 *
 *   const poppy = new Poppy(descriptor)
 *
 *   //
 *   // Let get another robot with with poppy1.local as hostname
 *   //
 *   const config = { host: poppy1.local }
 *   const descriptor1 = await discoverDescriptor(config)
 *
 *   const poppy1 = new Poppy(descriptor1, config)
 *
 *   ... // Nice stuff with poppy and poppy1
 *
 * }
 */
class Poppy {
  /**
   * Create a new Poppy object.
   *
   * Note creating a poppy object without any settings will use ones for a Poppy Ergo Jr,
   * @param {module:poppy-robot-core~Descriptor} descriptor - Robot descriptor
   * @param {module:poppy-robot-core~PoppyConfig=} config - Connection settings
  */
  constructor (descriptor, config) {
    this._descriptor = descriptor

    this._requestHandler = new RequestHandler(config)

    //
    // "Instantiate" the Motor objects and reference them
    // trough a new property named motor.name
    //
    descriptor.motors.forEach(motor => {
      this[motor.name] = new Motor(
        motor,
        this._requestHandler
      )
    })
  }

  /**
   * Accessor to the robot descriptor handled by this instance
   * @return {module:poppy-robot-core~Descriptor}
  */
  get descriptor () { return this._descriptor }

  /**
   * Accessor to the request handler for this robot
   * @return {module:poppy-robot-core~PoppyRequestHandler}
   */
  get requestHandler () { return this._requestHandler }

  /**
   * Return an array containing all registered motor names of the robot.
   * @return {Array.<string>}
  */
  get motorNames () { return this._descriptor.motors.map(m => m.name) }

  /**
   * Convinient function to manage the 'all' keyword for motor names.
   *
   * if input parameter is 'all' or an array including it,
   * it will return an array containing the name of all motors of the robot.
   * of the robot. Otherwise, the entry input will be returned.
   * @param {Array<string>|'all'} names - Names of motor provided as an array or 'all'
   * @returns {Array.<string>}
  */
  toMotorNames (names) {
    return names === 'all' || names.includes('all')
      ? this.motorNames
      : names
  }

  /**
   * Accessor on the motor Object by name.
   * @param {string} name - Motor name
   * @return {module:poppy-robot-core~ExtMotorRequest}
  */
  getMotor (name) { return this[name] }

  /**
   * Move a set of motors to target position(s).
   *
   * Duration of the movement could be constrained, if provided.
   * Otherwise, the speed register will be used.
   *
   * Note the speed register of motors could changed when duration is provided or wait is set to 'true'.
   * @param {object} input - input parameters
   * @param {Array.<string>|'all'} input.motors - Names of the target motors
   * @param {Array.<integer>|integer} input.positions - target position: Either an array containing
   *   all targeted position or an integer if position is the same for all motors
   * @param {number=} input.duration - duration of the movemement (in s)
   * @param {boolean=} [input.wait=false] - wait until the end of the movement
   * @return {Promise.<null>}
   * @example
   * const poppy = ...
   *
   * // Move all motors to position 0 degrees in 3s awaiting the end of the movement
   * await poppy.move({
   *   motors: 'all',
   *   positions: 0,
   *   duration: 3,
   *   wait: true
   * })
   *
   * // Send instruction to move m1, m2 and m3 to respectively
   * // positions 30, 50 and 90 degrees without:
   * // - Awaiting the end of movement,
   * // - Constraint on its duration (movement will be based on the speed of motors.)
   * await poppy.move({
   *   motors: ['m1', 'm2', 'm3'],
   *   positions: [30, 50, 90]
   * })
  */
  async move ({
    motors,
    positions,
    duration,
    wait = false
  } = {}) {
    const poppy = this
    const ppromises = []

    const motors_ = this.toMotorNames(motors)

    const positions_ = _toArray(positions, motors_.length)

    const fn = (motors, positions, duration, wait) => ({
      motors,
      positions,
      duration,
      wait
    })

    if (duration !== undefined) {
      ppromises.push(_ => poppy.goto(
        fn(motors_, positions_, duration, wait)
      ))
    } else if (duration === undefined && wait) {
      // Compute duration
      const durations = await Promise.all(motors_.map((motor, i) => poppy
        .getMotor(motor)
        .computeDuration({ end: positions_[i] })
      ))

      ppromises.push(_ => poppy.goto(
        fn(motors_, positions_, Math.max(...durations), wait)
      ))
    } else { // No duration, no wait instruction => delegate to motors
      ppromises.push(...motors_.map((motor, i) => _ => poppy
        .getMotor(motor)
        .setPosition(positions_[i], false)
      ))
    }

    return chainPromises(ppromises)
  }

  /**
   * Rotate a set of motors.
   *
   * Duration of the movement could be constrained, if provided.
   * Otherwise, the speed register will be used.
   *
   * Note the speed register of motors could changed when duration is provided or wait is set to 'true'.
   * @param {object} input - input parameters
   * @param {Array.<string>|'all'} input.motors - Names of the target motors
   * @param {Array.<integer>|integer} input.angles - rotation values: Either an array containing
   *   all angles or an integer if the rotation is the same for all motors
   * @param {number=} input.duration - duration of the movemement (in s)
   * @param {boolean=} [input.wait=false] - wait until the end of the movement
   * @return {Promise.<null>}
   * @example
   * const poppy = ...
   *
   * // Rotate all motors by 30 degrees in 3s awaiting the end of the movement
   * await poppy.move({
   *   motors: 'all',
   *   angles: 30,
   *   duration: 3,
   *   wait: true
   * })
   *
   * // Send instruction to rotate m1, m2 and m3 by respectively
   * // 30, 30 and 90 degrees without:
   * // - Awaiting the end of movement,
   * // - Constraint on its duration (movement will be based on the speed of motors.)
   * await poppy.move({
   *   motors: ['m1', 'm2', 'm3'],
   *   angles: [30, 30, 90]
   * })
  */
  async rotate ({
    motors,
    angles,
    duration,
    wait = false
  } = {}) {
    const poppy = this

    const motors_ = this.toMotorNames(motors)
    const angles_ = _toArray(angles, motors_.length)

    // Compute target positions
    const register = 'present_position'
    const data = await this.query({ motors: motors_, registers: [register] })

    const positions = motors_.map((motor, i) => data[motor][register] + angles_[i])

    // Compute duration if needed.
    // Start positions have been already get => decrease the number of requests.
    let duration_ = duration

    if (duration === undefined && wait) {
      const durations = await Promise.all(motors_.map((motor, i) => poppy
        .getMotor(motor)
        .computeDuration({
          start: data[motor][register],
          end: positions[i]
        })
      ))
      duration_ = Math.max(...durations)
    }

    // At last, use the move function to perform job
    return this.move({
      motors: motors_,
      positions,
      duration: duration_,
      wait
    })
  }

  /**
   * Access to the '/motors/goto' endpoint.
   * Note it will:
   *   - Be executed whatever the value of the compliant register
   *   - Set the speed register of targeted motors to fill the duration constraint
   * @param {object} input - input parameters
   * @param {Array.<string>|'all'} input.motors - Names of the target motors
   * @param {Array.<integer>|integer} input.positions - target position: Either an array containing
   *   all targeted position or an integer if position is the same for all motors
   * @param {number} input.duration - duration of the movemement (in s)
   * @param {boolean=} [input.wait=false] - wait until the end of the movement
   * @return {Promise.<null>}
   * @example
   * const poppy = ...
   *
   * // Move all motors to position 0 degrees in 3s awaiting the end of the movement
   * await poppy.goto({
   *   motors: 'all',
   *   positions: 0,
   *   duration: 3,
   *   wait: true
   * })
   *
   * // Send instruction to move m1, m2 and m3 to respectively
   * // positions 30, 50 and 90 degrees in 5s without awaiting the end of movement
   * await poppy.goto({
   *   motors: ['m1', 'm2', 'm3'],
   *   positions: [30, 50, 90],
   *   duration: 5
   * })
  */
  goto ({
    motors,
    positions,
    duration,
    wait = false
  } = {}) {
    const poppy = this
    const motors_ = this.toMotorNames(motors)

    const gotoRequest = _ => poppy.requestHandler.post(
      '/motors/goto.json',
      {
        motors: motors_,
        positions: _toArray(positions, motors_.length),
        duration: duration || 0.001,
        wait: false // true will 'block' http server on robot see (*)
      }
    )

    return chainPromises([
      gotoRequest,
      _ => wait ? pWait(duration) : Promise.resolve(null) // (*) simulate wait set to true
    ])
  }

  /**
   * Convinient method to query register(s) of all or a set of registered motors.
   * It returns an object gathering by motor the [ResponseObject]{@link module:poppy-robot-core~PoppyRequestHandler}.
   * @param {object} input - input parameters
   * @param {Array.<string>|'all'=} [input.motors='all'] - Names of the target motors
   * @param {Array.<string>} input.registers -  targeted registers
   * @return {Promise.<Object>}
   * @example
   * const poppy = ...
   *
   * await poppy.query({
   *   motors: ['m1', 'm2'],
   *   registers: ['present_position', 'goal_position']
   * })
   * // Will return a promise with result as
   * // {
   * //   m1: {present_position: 10, goal_position: 80},
   * //   m2: {present_position: 0, goal_position: -90},
   * // }
   * }
   * @see {@link module:poppy-robot-core~ResponseObject}
  */
  async query ({
    motors = 'all',
    registers
  } = {}) {
    const motors_ = this.toMotorNames(motors)

    const requests = motors_.map(motorName => async _ => {
      const motor = this.getMotor(motorName)
      const data = await motor.get(...registers)
      return { [motorName]: data }
    })

    return chainPromises(
      requests,
      (p, n) => ({ ...p, ...n }),
      {}
    )
  }

  /**
   * Execute Scripts.
   * @param {...module:poppy-robot-core~Script | Array.<module:poppy-robot-core~Script>} scripts - The scripts to execute
   * @return {Promise.<null>}
   */
  exec (...scripts) {
    const engine = new ScriptEngine(this)

    return engine.exec(...scripts)
  }
}

// ////////////////////////////////
// ////////////////////////////////
// Utility functions
// ////////////////////////////////
// ////////////////////////////////
const _toArray = (value, length) => Array.isArray(value)
  ? value
  : Array(length).fill(value)

// //////////////////////
// //////////////////////
// Public API
// //////////////////////
// //////////////////////

module.exports = Poppy
