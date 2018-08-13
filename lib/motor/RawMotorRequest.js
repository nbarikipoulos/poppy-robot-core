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

/**
 * Motor Descriptor.
 *
 * @typedef MotorDescriptor
 * @type Object
 * @property {string} name - name/id of the motor
 * @property {int} lower_limit - lower angle boundary of the motor
 * @property {int} upper_limit - upper angle boundary of the motor
 * @memberof module:poppy-robot-client
 * @inner
 * @category Typedefs
 */


/**
 * Class handling the primary requests to a Poppy motor _i.e._ the motor registry accesses.
 *
 * @see {@link module:poppy-robot-client~PoppyRequestHandler}
 * @memberof module:poppy-robot-client
 * @inner
 */
class RawMotorRequest {

    /**
     * Instantiate a new raw motor object.
     * @param {module:poppy-robot-client~MotorDescriptor} - motor descriptor 
     * @param {module:poppy-robot-client~PoppyRequestHandler} requestHandler - Poppy request handler object
     */
    constructor(motor, requestHandler) {
        this._motor = motor;
        this._reqHandler = requestHandler;
    }

    /**
     * (__async method__)
     * Set a register of the motor to a given value.
     * 
     * Not it must not be used for the led registry 
     * (see dedicated method.)
     * @param {string} register_name  - register name
     * @param {string} data - data as string
     * @return {Promise.<null>}
     */
    async set(register_name, data) {
        return await this._reqHandler.setMotorRegister(
            this._motor.name,
            register_name,
            data
        );
    }

    /**
     * (__async method__)
     * Get value of a given register.
     * @param {string} register_name  - register name
     * @return {Promise.<ResponseObject>}
     */
    async get(register_name) {
        return await this._reqHandler.getMotorRegister(
            this._motor.name,
            register_name
        );
    }

    /**
     * (__async method__)
     * Set the led register.
     * @param {'off'|'red'|'green'|'blue'|'yellow'|'cyan'|'pink'|'white'} color  - register name
     * @return {Promise.<null>}
     */
    async led(color) {
        return await this._reqHandler.led(
            this._motor.name,
            color
        );
    }

    /**
     * Get the allowed values for the led register.
     * @return {Array.<string>}
     */
    getLedValues() {
        return [].concat(..._LED_VALUES);
    }

}

const _LED_VALUES = [
    'off',
    'red',
    'green',
    'blue',
    'yellow',
    'cyan',
    'pink',
    'white'
];

/////////////////////////
/////////////////////////
// Public API
/////////////////////////
/////////////////////////

module.exports = RawMotorRequest;