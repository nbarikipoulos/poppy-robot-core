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

const RawMotorRequest = require('../lib/motor/RawMotorRequest');

//////////////////////////////////
// Option helper
//////////////////////////////////

//FIXME TO REWRITE !!!
class OptionHelper {

    constructor() {}

    // For CLI only, it needs a poppy instance
    // to populate the motor options.
    init(poppy) {
            
        let motorIds = poppy.getAllMotorIds();

        // Motor Ids

        _OPTIONS.motor.details.choices.push(
            ...motorIds
        );

        // Led values

        let leds = RawMotorRequest.prototype.getLedValues();

        let details = _OPTIONS.led.details;
        details.default = leds.shift();
        details.choices = [details.default].concat(...leds);
    }

    addOptions(yargs, groupName, optionKeys, ...mandatoryOptionKeys) {

        let opts = this._toObject(optionKeys);

        for (let opt in opts) {
            yargs.options(
                opts[opt].key,
                opts[opt].details
            );
        }
        
        mandatoryOptionKeys.forEach( opt => yargs.demand(
            opts[opt].key,
            'This option is mandatory.'
        ));

        if ( groupName ) {
            yargs.group( // Group all these options in one group.
                optionKeys.map( opt => opts[opt].key),
                groupName
            );
        }

    }
    
    addPoppyConfigurationOptions(yargs) {
        this.addOptions(
            yargs,
            'Poppy Configuration Options:',
            ['ip', 'http_port', 'snap_port']
        );
    }

    _toObject(keys) {
        return keys.reduce(
            (acc, key) => {
                acc[key] = _OPTIONS[key];
                return acc;
            },
            Object.create(null)
        );
    }

}

//////////////////////////////////
// Argument "descriptors"
//////////////////////////////////

const _OPTIONS = {
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
        key: 'I',
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
            type: 'number',
            describe: 'Set the rotation speed of the selected motor(s).'
                + ' Value must be in the [0,1023] range.'
        }
    },
    rotate: {
        key: 'v',
        details: {
            alias: 'value',
            type: 'number',
            describe: 'Rotate the selected motor(s) by x degrees.'
        }
    },
    position: {
        key: 'v',
        details: {
            alias: 'value',
            type: 'number',
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
    },
    ip: {
        key: 'i',
        details: {
            alias: 'ip',
            type: 'string',
            default: 'poppy.local',
            describe: 'Set the Poppy IP/hostname.'
        } 
    },
    http_port: {
        key: 'p',
        details: {
            alias: 'http-port',
            type: 'number',
            default: 8080,
            describe: 'Set the Poppy http server port.'
        }
    },
    snap_port: {
        key: 'P',
        details: {
            alias: 'snap-port',
            type: 'number',
            default: 6969,
            describe: 'Set the Poppy snap server port.'
        }
    }
};

//////////////////////////////////
// Utility functions
//////////////////////////////////

const getPoppyConfiguration = (argv) => {
    return {
        connect: { // Poppy configuration is called before initializing the yargs context...
            ip: argv.ip || argv.i,
            httpPort: argv.httpPort || argv.p,
            snapPort: argv.snapPort || argv.P
        }
    }
};

//////////////////////////////////
//////////////////////////////////
// Public API
//////////////////////////////////
//////////////////////////////////

module.exports = {
    OptionHelper,
    getPoppyConfiguration
};