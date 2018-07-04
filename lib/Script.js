/*!
 * (The MIT License)
 *
 * Copyright (c) 2018 N. Barikipoulos <nikolaos.barikipoulos@outlook.fr>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict'

class Script {

    constructor(...motorIds) {
      this._actionHandlers = [].concat(
        new ActionHandler(motorIds) // append a default ActionHandlers to this script
      );
    }

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

    led(value) {
      this._addAction('led',value);
      return this;
    }

    position(value, wait = true) {
      this._addAction('setPosition', value, wait);
      return this;
    }

    rotate(value, wait = true) {
      this._addAction('rotate', value, wait);
      return this;
    }

    speed(value) {
      this._addAction('setSpeed', value);
      return this;
    }

    compliant(value) {
      this._addAction('setCompliant', value);
      return this;
    }

    wait(value) {
      this._addAction('wait', value);
      return this;
    }

    _addAction(id, ...values) {
      let currentElement = this._getCurrentActionHandler();
      currentElement.addAction(id, values);
    }

    _getCurrentActionHandler() {
      return this._actionHandlers[
        this._actionHandlers.length-1
      ];
    }

}

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