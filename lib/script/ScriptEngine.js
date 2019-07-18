/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

/**
 * Script execution engine.
 */
class ScriptEngine {

  constructor(poppy) {
    this._poppy = poppy;
  }

  /**
   * (__async method__)
   * Execute Scripts.
   * @param {...module:poppy-robot-core~Script} scripts - The scripts to execute
   * @return {Promise.<null>}
   */
   async exec(...scripts) {
     await scripts.reduce(
         (acc, sc) => acc.then( _ => this._exec(sc)),
         Promise.resolve(null)
     );

     return this; 
  }

  /** @private */
  async _exec(script) {

    let actionHandlers = script._actionHandlers;

    // Transform Script objects to an array of object of kind
    // { motor, id, values }
    let elements = [].concat(...actionHandlers.map( aHandler => {

      // The target motors
      let motors = 'all' === aHandler.getMotors()[0]?
        this._poppy._all:
        aHandler.getMotors()
      ;

      let actions = aHandler.getActions();

      return [].concat(...actions.map( action => {
        let result;
        if ( 'wait' === action.id ) { // 'wait' action will only apply once,
                                      // not on every selected motors
          result = [].concat({
            motor: this._poppy._all[0],
            id: action.id,
            values: action.values
            });
          } else {
            result = motors.map( motor => ({
              motor,
              id: action.id,
              values: action.values
              })
            );
          }
          return result;
        }     
      ));
    }));

    // The execution stage itself
    return elements.reduce(
      (acc, current) => acc.then( _ => this._poppy[current.motor][current.id](...current.values) )
        .catch( err => {
          console.log(`Err: Unable to perform script op ${current.id} on motor ${current.motor}. Check connection settings:`);
          console.log(`   Request URL: ${err.config.url}`);
        }),
      Promise.resolve(null)
    );
  }

}

/////////////////////////
/////////////////////////
// Public API
/////////////////////////
/////////////////////////

module.exports = ScriptEngine;