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

class RawMotorRequest {

    constructor(motor, requestHandler) {
        this._motor = motor;
        this._reqHandler = requestHandler;
    }

    async set(register_name, data) {
        return await this._reqHandler.setMotorRegister(
            this._motor.name,
            register_name,
            data
        );
    }

    async get(register_name) {
        return await this._reqHandler.getMotorRegister(
            this._motor.name,
            register_name
        );
    }

    async led(color) {
        return await this._reqHandler.led(
            this._motor.name,
            color
        );
    }

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