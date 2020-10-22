/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

/**
 * Script execution engine.
 * @memberof module:poppy-robot-core
 * @inner
 */
class ScriptEngine {
  constructor (poppy) {
    this._poppy = poppy
  }

  /**
   * Execute Scripts.
   * @param {...module:poppy-robot-core~Script} scripts - The scripts to execute
   * @return {Promise.<null>}
  */
  async exec (...scripts) {
    await scripts.reduce(
      (acc, sc) => acc.then(_ => this._exec(sc)),
      Promise.resolve(null)
    )

    return this
  }

  /** @private */
  async _exec (script) {
    const actionHandlers = script._actionHandlers

    // Transform Script objects to an array of object of kind
    // { motor, id, values }
    const elements = [].concat(...actionHandlers.map(aHandler => {
      // The target motors
      const motors = aHandler.getMotors()[0] === 'all'
        ? this._poppy.getAllMotorIds()
        : aHandler.getMotors()

      const actions = aHandler.getActions()

      return [].concat(...actions.map(action => {
        let result
        // 'wait' action should only apply once, not on every selected motors
        if (action.id === 'wait') {
          result = [].concat({
            motor: motors[0],
            id: action.id,
            values: action.values
          })
        } else {
          result = motors.map(motor => ({
            motor,
            id: action.id,
            values: action.values
          })
          )
        }

        return result
      }))
    }))

    // The execution stage itself
    return elements.reduce(
      (acc, elt) => acc.then(_ => this._poppy[elt.motor][elt.id](...elt.values))
        .catch(error => {
          console.log(`Error: Unable to perform action ${elt.id} on motor ${elt.motor}.\n${error.message}`)
        }),
      Promise.resolve(null)
    )
  }
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = ScriptEngine
