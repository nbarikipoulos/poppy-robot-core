/*! Copyright (c) 2018 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

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
 * @memberof module:poppy-robot-client
 * @inner
 * @example
 * const Script = require('poppy-robot-client').Script;
 * 
 * let script = new Script('all') // Select all motors
 *   .compliant(false) // Make them "drivable"
 *   .speed(100) // Set all motor speed to 100
 *  ;
 *
 * let myOtherScript = new Script('m1', 'm3') // Only select the 'm1' and 'm2' motors
 *   .rotate(30) // rotate 'm1' and 'm3' by 30 degrees.
 *   .select('m4') // select the 'm4' motor for next action
 *   .rotate(20) // Rotate 'm4' by 20 degrees
 * ;
 */
class Script {

    /**
     * Create a new Script Object.
     * 
     * It could optionally set the targeted motor for the next actions of
     * this script.
     * @param {string} motorIds  - the motor id/name or 'all' to select all motors
     */
    constructor(...motorIds) {
      this._actionHandlers = [].concat(
        new ActionHandler(motorIds) // append a default ActionHandlers to this script
      );
    }

    /**
     * Select the target motor(s) for the next script actions.
     * It will define the targeted motor(s) until the next __select__ action, if any.
     * @param {...string} motorId - the id (_i.e._ name) of the selected motor or 'all' to select all motors
     * @return {module:poppy-robot-client~Script}
     * 
     * @example
     * let script = P.createScript()
     *    .select('all') // Select all motors...
     *    .compliant(false) // Make them "drivable"
     *    .position(0) // ... move all motors to position 'O' degree.
     *    . ...        // ... do other nice stuffs (always on all motors)
     *    . ...
     *    .select('m1','m2') // Next select only the motors 'm1' and 'm2'...
     *    .rotate(30) // and apply them a rotation by +30 degrees.
     * ;
     */
    select(...motorIds) {
      let current = this._getCurrentActionHandler();
      if ( !current.hasMotorSet() ) { // Set the current action handler if it has no motor ids...
        current.setMotors(motorIds);
      } else { // ... Or create new one.
        this._actionHandlers.push(
          new ActionHandler(motorIds)
        );
      }

      return this;
    }

    /**
     * Set the led value of the target motor(s).
     * @param {('off'|'red'|'green'|'blue'|'yellow'|'cyan'|'pink')} value - value for the 'led' registry
     * @return {module:poppy-robot-client~Script}
     * @example
     * let script = P.createScript('all')
     *    .led('blue') // will set the led color to blue
     * ;
     */
    led(value) {
      this._addAction('led',value);
      return this;
    }

    /**
     * Set the target position (registry 'goal_position') of the selected motor(s).
     * 
     * It will create an action which will move the selected motor(s) to a given position.
     * 
     * @param {integer} value - the position to reach in degree
     * @param {boolean=} [wait=true] - optionally wait that motor(s) reach(s)
     *    the target position until executing the next action
     * @return {module:poppy-robot-client~Script}
     * @example
     * let script = P.createScript('all')
     *    .position(0) // Move all motors to 0 degrees.
     *                  // It will await all motors reach this position)
     *    .select('m6')
     *    .position(90, false) // It will send an instruction 
     *                         // to Move the motor 'm6' to 90 degrees.
     *                         // Without awaiting this position is reach, 
     *                         // the next action will be executed.
     *    .select('m2')
     *    .position(-75)
     * ;
     */
    position(value, wait = true) {
      this._addAction('setPosition', value, wait);
      return this;
    }

    /**
     * Create an action to rotate the selected motor(s) by x degrees.
     * 
     * @param {integer} value - the rotation value, in degrees
     * @param {boolean=} [wait=true] - optionally wait that motor(s) will finish
     *    their rotations until executing the next action
     * @return {module:poppy-robot-client~Script}
     * @example
     * let script = new Script('m1', 'm5')
     *    .rotate(-30) // Rotate by -30 degrees the selected motors.
     *                 // It will await all motors finish their rotation)
     *    .select('m6')
     *    .rotate(60, false) // It will send an instruction in order to rotate
     *                       // the motor 'm6' by 60 degrees.
     *                       // Without awaiting the end of this action, 
     *                      // the next action will be executed.
     *    .select('m5')
     *    .rotate(20)
     * ;
     */
    rotate(value, wait = true) {
      this._addAction('rotate', value, wait);
      return this;
    }

    /**
     * Set the speed (registry 'moving_speed') of the selected motor(s).
     * 
     * @param {integer} value - the speed value. It should be included into
     *    the [0,1023] range (speed is conversely to the value)
     * @return {module:poppy-robot-client~Script}
     * @example
     * let script = P.createScript('all')
     *    .speed(100) // Set the speed of all motor to 100
     * ;
     */
    speed(value) {
      this._addAction('setSpeed', value);
      return this;
    }

    /**
     * Set the 'compliant' registry of the selected motor(s).
     * It allows to select the motor state between programmatically "drivable" (false)
     *  or in "rest" mode (true) _i.e._ movable by hand.
     * @param {boolean} value -  __false__ for "drivable" state, __true__ for "rest" mode.
     * @return {module:poppy-robot-client~Script}
     * @example
     * let script = P.createScript('all')
     *    .compliant(false)
     * ;
     */
    compliant(value) {
      this._addAction('setCompliant', value);
      return this;
    }

    /**
     * The wait method. It allows to stop the script execution during a given
     * delay.
     * 
     * It mainly dedicated to wait the end of asynchronous actions.
     * 
     * @param {integer} value - wait delay (in ms)
     * @return {module:poppy-robot-client~Script}
     * @example
     * let script = P.createScript()
     *    .select('m2')
     *    .position(-90, false) // we do not wait the end of movement
     *    .select('m3')
     *    .position(90, false) // idem
     *    .select('m5')
     *    .position(-90, false) // idem
     *    .wait(1000) // Wait 1 second
     * ;
     */
    wait(value) {
      this._addAction('wait', value);
      return this;
    }

    /** @private */
    _addAction(id, ...values) {
      let currentElement = this._getCurrentActionHandler();
      currentElement.addAction(id, values);
    }

    /** @private */
    _getCurrentActionHandler() {
      return this._actionHandlers[
        this._actionHandlers.length-1
      ];
    }

}

/** @private */
class ActionHandler {

    constructor(motorIds) {
        this._motorIds = [].concat(...motorIds);
        this._actions = [];
    }

    hasMotorSet() {return 0 !== this.getMotors().length;}

    getMotors() {return this._motorIds;}

    setMotors(motorIds) {
        this._motorIds = motorIds;
    }

    getActions() { return this._actions;}

    addAction(id, values) {
        this._actions.push({id, values});
    }

}


//////////////////////////////////
//////////////////////////////////
// Public API
//////////////////////////////////
//////////////////////////////////

module.exports = Script;