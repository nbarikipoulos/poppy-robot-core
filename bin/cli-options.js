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

const P = require('../index');

//////////////////////////////////
// Argument "descriptors"
//////////////////////////////////

const OPTIONS = {
    motor: {
        key: 'm',
        details: {
            alias: 'motor',
            type: 'array',
            choices: ['all'], // init()
            default: 'all',
            describe: 'Name of the target motor(s). Type \'all\' to select all available motors.'
        }
    },
    register: {
        key: 'r',
        details: {
            alias: 'register',
            type: 'array',
            default: [
                'compliant',
                'lower_limit',
                'present_position',
                'goal_position',
                'upper_limit',
                'moving_speed',
                'present_temperature'
            ],
            choices: [
                'compliant',
                'lower_limit',
                'present_position',
                'goal_position',
                'upper_limit',
                'moving_speed',
                'present_temperature',
                'led'
            ],
            describe: 'Select register value(s).'
        }
    },
    invert: {
        key: 'i',
        details: {
            alias: 'invert',
            type: 'boolean',
            default: 'false',
            describe: 'Invert table presentation i.e. motors are displayed as row.'
        }
    },
    compliant: {
        key: 'v',
        details: {
            alias: 'value',
            type: 'string',
            default: 'off',
            choices: [
                'on', // 'true' 
                'off' // 'false' => motor is "addressable"
            ]
        } 
    },
    speed: {
        key: 'v',
        details: {
            alias: 'value',
            type: 'integer',
            describe: 'Set the rotation speed of the selected motor(s).'
                + ' Value must be in the [0,1023] range.'
        }
    },
    rotate: {
        key: 'v',
        details: {
            alias: 'value',
            type: 'integer',
            describe: 'Rotate the selected motor(s) by x degrees.'
        }
    },
    position: {
        key: 'v',
        details: {
            alias: 'value',
            type: 'integer',
            describe: 'Move the selected motor(s) to a given position.'
        }
    },
    wait: {
        key: 'w',
        details: {
            alias: 'wait',
            type: 'boolean',
            default: 'false',
            describe: 'Wait until this command is finished.'
        }
    },
    led: {
        key: 'v',
        details: {
            alias: 'value',
            type: 'string',
            default: undefined, // init()
            choices: [], // init()
            describe: 'The led color (or turn-off) value.'
        }
    }
};

//////////////////////////////////
// misc.
//////////////////////////////////

const get = (key) => OPTIONS[key];

//FIXME TO REWRITE !!!
const _initOptions = (poppy) => {

    // Motor Ids
    
    OPTIONS.motor.details.choices.push(
        ...poppy.getAllMotorIds()
    );

    // Led values

    let leds = P.Motor.prototype.getLedValues();

    let details = OPTIONS.led.details;
    details.default = leds.shift();
    details.choices = [details.default].concat(...leds);
}


//////////////////////////////////
//////////////////////////////////
// Public API
//////////////////////////////////
//////////////////////////////////

module.exports = {
    get,
    init: (poppy) => {
        _initOptions(poppy);
    },
    toObject: (...keys) => keys.reduce(
        (acc, key) => {
            acc[key] = get(key);
            return acc;
        },
        Object.create(null)
    ),
    EPILOGUE:
        'Poppy CLI. (c)2018 N. Barikipoulos. Released under the MIT license.\n'
        + 'More details on http://github.com/nbarikipoulos/poppy-robot-cli'
};