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

const util = require('util');

const RawMotorRequest = require('./RawMotorRequest');

class ExtMotorRequest extends RawMotorRequest {

    constructor(
        motor,
        connect
    ) {
        super(connect);

        this._motor = motor;
    }

    async led(color) {
        return await super.led(
            this._motor.name,
            color
        );
    }

    async setSpeed(speed) {
        return await this.set(
            this._motor.name,
            'moving_speed',
            speed.toString()
        );
    }

    async setCompliant(value) {
        return await this.set(
            this._motor.name,
            'compliant',
            value.toString()
        );
    }

    async setPosition(value, wait = false) {
        return !wait ?
            await this.set(
                this._motor.name,
                'goal_position',
                value.toString()
            ):
            await this._waitGoTo(value);
        ;
    }

    async rotate(value, wait = true) {
        let current = await this.get(this._motor.name, 'present_position');
        let goal = current['present_position'] + Number.parseFloat(value);

        return wait ?
            await this._waitGoTo(goal):
            await this.set(
                this._motor.name,
                'goal_position',
                goal.toString()
            )
        ;
    }

    async wait(value) {
        return await _wait(undefined, value)
    } 

    async _waitGoTo(targetValue) {

        let property = 'present_position';
    
        let previousValue = 1000; // set to a dummy value

        let checkValue = _ => _wait(0, 100)
            .then( _ => this.get(this._motor.name, property))
            .then( res => {
                    let currentValue = res[property];
                    if (
                        Math.abs(currentValue - targetValue) < 1.7 ||
                        Math.abs(currentValue - previousValue) < 0.5 // arf...
                    ) {
                        return Promise.reject('done'); // Rejected but done.
                    } else {
                        previousValue = currentValue;
                    }
                }
            )
        ;
    
        let n = 10;
        let arr = Array(n).fill(checkValue);
        arr.unshift( _ => this.setPosition(targetValue) )
    
        return arr.reduce(
            (acc, current) => acc.then( _ => current() ),
            Promise.resolve(null)
        ).catch( err => {console.log('==>', this._motor.name, err);} )
    }

}

//////////////////////////////////
// Utility functions
//////////////////////////////////

let _wait = (res, delay) => new Promise(
    (resolve) => setTimeout (resolve, delay | _DEFAULT_DELAY , res)
);

const _DEFAULT_DELAY = 50;

//////////////////////////////////
//////////////////////////////////
// Public API
//////////////////////////////////
//////////////////////////////////

module.exports = ExtMotorRequest;