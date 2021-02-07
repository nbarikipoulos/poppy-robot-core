/*! Copyright (c) 2018-2019, 2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { ExtMotorRequest: Motor } = require('../motor')
const { PoppyRequestHandler: RequestHandler } = require('../request')
const { ScriptEngine } = require('../script')

const { chainPromises } = require('../../util/misc')

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
 *   await desc = discoverDescriptor()
 *
 *   const poppy = new Poppy(desc)
 *
 *   //
 *   // Let get another robot with with poppy1.local as hostname
 *   //
 *   const connect = { hostname: poppy1.local }
 *   const desc1 = await discoverDescriptor(connect)
 *
 *   const poppy1 = new Poppy(desc1, connect)
 *
 *   ... // Nice stuff with poppy and poppy1
 *
 * }
 */
class Poppy {
  /**
   * Create a new Poppy object.
   *
   * Note creatingting a poppy object without any settings will use ones
   * for a Poppy Ergo Jr,
   * @param {module:poppy-robot-core~Descriptor} descriptor - Robot descriptor
   * @param {module:poppy-robot-core~ConnectionSettings=} connect - Connection Settings to Poppy
  */
  constructor (descriptor, connect) {
    this._descriptor = descriptor

    const req = new RequestHandler(connect)

    //
    // "Instantiate" the Motor objects and reference them
    // trough a new property named motor.name (aka id)
    //
    descriptor.motors.forEach(m => {
      this[m.name] = new Motor(m, req)
    })
  }

  /**
   * Accessor to the robot descriptor handled by this instance/
   * @return {module:poppy-robot-core~Descriptor}
  */
  getDescriptor () { return this._descriptor }

  /**
   * Return a list containing all registered motor names/ids for this instance.
   * @return {Array.<string>}
  */
  getAllMotorIds () {
    return this._descriptor.motors.map(m => m.name)
  }

  /**
   * Accessor on the motor Object named/with id 'id'.
   * @param {string} id - motor name/id
   * @return {module:poppy-robot-core~ExtMotorRequest}
  */
  getMotor (id) {
    return this[id]
  }

  /**
   * Convinient method to query register(s) of all or a set of registered motors.
   * It returns an object gathering by motor the [ResponseObject]{@link module:poppy-robot-core~PoppyRequestHandler}.
   * @param {Array.<string>|'all'} motorIds - target motor name(s)/id(s)
   * @param {Array.<string>} registers - target registers
   * @return {Promise.<Object>}
   * @example
   * const { Poppy } = require('poppy-robot-core')
   *
   * const f = async _ => {
   *   const desc = ...
   *
   *   const poppy = new Poppy(desc)
   *
   *   poppy.query(['m1', 'm2'], ['present_position', 'goal_position'])
   *   // Will return a promise with result as
   *   // {
   *   //   m1: {present_position: 10, goal_position: 80},
   *   //   m2: {present_position: 0, goal_position: -90},
   *   // }
   * }
   * @see {@link module:poppy-robot-core~ResponseObject}
  */
  async query (motorIds, registers) {
    const targetMotorIds = motorIds === 'all'
      ? this.getAllMotorIds()
      : motorIds

    const requests = targetMotorIds.map(motorName => async _ => {
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
  async exec (...scripts) {
    const engine = new ScriptEngine(this)

    return engine.exec(...scripts)
  }
}

// //////////////////////
// //////////////////////
// Public API
// //////////////////////
// //////////////////////

module.exports = Poppy
