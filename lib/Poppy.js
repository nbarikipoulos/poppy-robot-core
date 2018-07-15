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

const Motor = require('./motor/ExtMotorRequest');

const readDescriptor = require('./utils/descriptor').read;

const DESCRIPTOR_DEFAULT = 'desc://poppy-ergo-jr';
const CNX_DEFAULT = {
    schema: 'http',
    ip: 'poppy.local',
    httpPort: 8080,
    snapPort: 6969,
    timeout: 2000
};

class Poppy {

    constructor({
        descriptor, // A descriptor locator (see utils/descriptor)
        connect
    } = {}) {
        this._init(descriptor, connect);
    }

    getConfig() { return this._config;}

    getAllMotorIds() { return [].concat(...this._all);}

    getMotor(id) { return this[id];}

    async exec(...scripts) {
        await scripts.reduce( (acc, sc) => acc.then( _ => this._exec(sc))
        ,Promise.resolve(null));

        return this;
        
    }

    async _exec(script) {

        let actionHandlers = script._actionHandlers;

        // Transform Script objects to an array of object of kind
        // { motor, id, values }
        let elements = [].concat(...actionHandlers.map( aHandler => {

            // The target motors
            let motors = 'all' === aHandler.getMotors()[0]?
                this._all:
                aHandler.getMotors()
            ;

            let actions = aHandler.getActions();

            return [].concat(...actions.map( action => {
                let result;
                if ( 'wait' === action.id ) { // 'wait' action will only apply once,
                                              // not on every selected motors
                    result = [].concat({
                        motor: this._all[0],
                        id: action.id,
                        values: action.values
                    });
                } else {
                    result = motors.map( motor => ({
                        motor,
                        id: action.id,
                        values: action.values
                    }));
                }
                return result;
            }
                
            ));
        }));

        // The execution stage itself
        return elements.reduce( (acc, current) =>
            acc.then( _ => this[current.motor][current.id](...current.values) )
                .catch( err => console.log(err) )
            ,Promise.resolve(null)
        );
    }

    _init(descriptor, connect) {

        //
        // First of all, let store the configuration of the robot
        //

        this._config = Object.assign(
            {},
            descriptor,
            {connect : Object.assign(
                {}, CNX_DEFAULT, connect
            )}
        );
    
        //
        // On a second hand, let's obtain the descriptor
        //

        try {
            this._descriptor = readDescriptor(
                descriptor || DESCRIPTOR_DEFAULT
            );
        } catch(error) {
            throw error;
        }

        //
        // At last, let init the motors
        //

        let motors = this._descriptor.motors;

        this._all = [];

        motors.forEach(motor => {
            this._all.push(motor.name); // Store all the motor ids
            // "Instantiate" a Motor object and reference it to a new attribute motor.name (aka id)
            this[motor.name] = new Motor(
                motor,
                this.getConfig().connect
            );
        });
    }

}

/////////////////////////
/////////////////////////
// Public API
/////////////////////////
/////////////////////////

module.exports = Poppy;
