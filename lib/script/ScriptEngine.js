/*! Copyright (c) 2019-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const { chainPromises } = require('../../util/misc')

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
   * @param {...module:poppy-robot-core~Script | Array.<module:poppy-robot-core~Script>} scripts - The scripts to execute
   * @return {Promise.<null>}
  */
  async exec (...scripts) {
    const _scripts = scripts.flat()
    return chainPromises(
      _scripts.map(script => _ => this._exec(script))
    )
  }

  /** @private */
  async _exec (script) {
    const actionHandlers = script._actionHandlers

    // Transform Script objects to an array of object of kind { motor, id, values }
    const elements = actionHandlers
      .map(aHandler => {
        // The target motors
        const motors = aHandler.getMotors()[0] === 'all'
          ? this._poppy.getAllMotorIds()
          : aHandler.getMotors()

        return aHandler.getActions()
          .map(action => {
            // 'wait' action should only apply once, not on every selected motors
            const tgtMotors = action.id === 'wait' ? [motors[0]] : motors

            return tgtMotors.map(motor => ({
              motor,
              id: action.id,
              values: action.values
            }))
          })
      })
      .flat(Infinity)

    const ppromises = elements.map(elt =>
      _ => this._poppy[elt.motor][elt.id](...elt.values)
        .catch(err => {
          console.log(`Error: Unable to perform action ${elt.id} on motor ${elt.motor}.\n${err.message}`)
        })
    )

    return chainPromises(ppromises)
  }
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = ScriptEngine
