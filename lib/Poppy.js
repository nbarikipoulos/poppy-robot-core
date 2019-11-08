/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const Motor = require('./motor/ExtMotorRequest')

const RequestHandler = require('./utils/PoppyRequestHandler')
const readDescriptor = require('./utils/descriptor').read

const ScriptEngine = require('./script/ScriptEngine')

const promiseAll = require('../util/misc').promiseAll

/**
 * The main object of the module.
 * The poppy object handles:
 * - The robot descriptor aka the aliases and motors configuration,
 * - The object in charge of the requests to the robot,
 * - At last the script execution engine.
 *
 * Note contrary to instantiating it through the factory P.createPoppy, it does not
 * take into account settings from the .poppyrc file or passed through CLI flags.
 * @memberof module:poppy-robot-core
 * @inner
 * @example
 * const Poppy = require('poppy-robot-core').Poppy
 *
 * const poppy = new Poppy() // create a poppy object
 *                          // using default settings for a Poppy Ergo Jr.
 *
 * const anotherPoppy = new Poppy({ // Another Poppy Ergo Jr...
 *    connect : { // ...with custom connection settings:xs
 *      ip: poppy1.local // hostname set to poppy1.local
 *      httpPort: 8081   // and http server on port 8081
 *    }
 * })
 */
class Poppy {
  /**
   * Instantiate a new Poppy object.
   *
   * Note Intantitating a poppy object without any settings will use ones
   * for a Poppy Ergo Jr,
   * @param {Object=} options - settings object
   * @param {module:poppy-robot-core~DescriptorLocator=} options.descriptor - Descriptor locator
   * @param {module:poppy-robot-core~ConnectionSettings=} options.connect - Connection Settings to Poppy
  */
  constructor ({
    descriptor, // A descriptor locator (see utils/descriptor)
    connect // Connection Settings
  } = {}) {
    this._descriptor = undefined // descriptor
    this._requestHandler = undefined // request handler

    // Init the Robot context
    this._init(descriptor, connect)

    // Store the configuration
    this._config = Object.assign(
      {},
      { descriptor, connect }
    )
  }

  /**
   * Accessor to the config object passed at instantiation time __i.e.__
   * without defaut values/
   * @return {Object}
  */
  getConfig () {
    return this._config
  }

  /**
   * Accessor to the robot descriptor handled by this instance/
   * @return {Object}
  */
  getDescriptor () {
    return this._descriptor
  }

  /**
   * Return a list containing all registered motor names/ids for this instance.
   * @return {Array.<string>}
  */
  getAllMotorIds () {
    return [].concat(...this._all)
  }

  /**
   * Accessor on the motor Object named/with id 'id'.
   * @param {string} id - motor name/id
   * @return {module:poppy-robot-core~RawMotorRequest}
  */
  getMotor (id) {
    return this[id]
  }

  /**
   * Convinient method to query register(s) of all or a set of registered motors.
   * It returns an object with properties named with to the motor name
   * and set to the [ResponseObject]{@link module:poppy-robot-core~PoppyRequestHandler} which contains the queried register values.
   * @param {Array.<string>|'all'} motorIds - target motor name(s)/id(s)
   * @param {Array.<string>} registers - target registers
   * @return {Promise.<Object>}
   * @example
   * const Poppy = require('poppy-robot-core').Poppy
   *
   * const poppy = new Poppy()
   *
   * poppy.query(['m1', 'm2'], ['present_position', 'goal_position'])
   * // Will return a promise with result as
   * // {
   * //   m1: {present_position: 10, goal_position: 80},
   * //   m2: {present_position: 0, goal_position: -90},
   * //}
   * @see {@link module:poppy-robot-core~ResponseObject}
  */
  async query (motorIds, registers) {
    const targetMotorIds = motorIds === 'all'
      ? this._all
      : motorIds

    const results = await promiseAll(
      targetMotorIds,
      async motorName => {
        const motor = this.getMotor(motorName)
        const data = await motor.get(...registers)
        return { [motorName]: data }
      })

    return Object.assign({}, ...results)
  }

  /**
   * (__async method__)
   * Execute Scripts.
   * @param {...module:poppy-robot-core~Script} scripts - The scripts to execute
   * @return {Promise.<null>}
   */
  async exec (...scripts) {
    const engine = new ScriptEngine(this)

    return engine.exec(...scripts)
  }

  /**
   * Initialize the Poppy robot context
   * @private
  */
  _init (descriptor, connexionSettings) {
    // First, let instantiate a request handler for this poppy...
    this._requestHandler = new RequestHandler(
      connexionSettings
    )

    // On a second hand, let's read the descriptor
    this._descriptor = readDescriptor(descriptor)

    // At last, let init the motors

    const motors = this._descriptor.motors

    this._all = []

    motors.forEach(motor => {
      this._all.push(motor.name) // Store all the motor ids
      // "Instantiate" a Motor object and reference it to a new attribute motor.name (aka id)
      this[motor.name] = new Motor(
        motor,
        this._requestHandler
      )
    })
  }
}

// //////////////////////
// //////////////////////
// Public API
// //////////////////////
// //////////////////////

module.exports = Poppy
