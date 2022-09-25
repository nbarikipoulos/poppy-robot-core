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
  exec (...scripts) {
    const _scripts = scripts.flat(Infinity)
    return chainPromises(
      _scripts.map(script => _ => this._exec(script))
    )
  }

  /** @private */
  _exec (script) {
    const actionHandlers = script._actionHandlers

    // Transform Script objects to an array of object of kind { motor, id, values }
    const elements = actionHandlers
      .map(aHandler => {
        // The target motors
        const motors = this._poppy.toMotorNames(aHandler.motors)
        return aHandler.actions.map(action => this._mapAction(motors, action))
      })
      .flat(Infinity)

    const ppromises = elements.map(elt => {
      const object = elt.motor === undefined
        ? this._poppy
        : this._poppy[elt.motor]

      return _ => object[elt.id](...elt.values)
        .catch(err => {
          const msg = elt.motor === undefined
            ? `on motor ${elt.motor}`
            : 'poppy'
          console.log(`Error: Unable to perform '${elt.id}' on ${msg}.\n${err.message}`)
        })
    })

    return chainPromises(ppromises)
  }

  /** @private */
  _mapAction (motors, action) {
    let elements = motors
    let values = Object.values(action.param)

    switch (action.id) {
      case 'wait' :
        // 'wait' action should only apply once, not on every selected motors
        elements = [motors[0]]
        break
      case 'move':
      case 'rotate':
        elements = ['poppy']
        values = [{ motors, ...action.param }]
        break
      default:
        // Do nothing
    }

    return elements.map(elt => ({ // aka motor name or 'poppy'
      motor: elt === 'poppy' ? undefined : elt,
      id: action.id,
      values
    }))
  }
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = ScriptEngine
