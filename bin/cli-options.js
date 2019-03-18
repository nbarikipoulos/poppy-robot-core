/*! Copyright (c) 2018 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const fs = require('fs');
const path = require('path');

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

    get(optionKey) {
        return _OPTIONS[optionKey];
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
            'Poppy Setting Options:',
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
            nargs: 1,
            type: 'number',
            describe: 'Set the rotation speed of the selected motor(s).'
                + ' Value must be in the [0,1023] range.'
        }
    },
    rotate: {
        key: 'v',
        details: {
            alias: 'value',
            nargs: 1,
            type: 'number',
            describe: 'Rotate the selected motor(s) by x degrees.'
        }
    },
    position: {
        key: 'v',
        details: {
            alias: 'value',
            nargs: 1,
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
            nargs: 1,
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
            nargs: 1,
            default: 8080,
            describe: 'Set the Poppy http server port.'
        }
    },
    snap_port: {
        key: 'P',
        details: {
            alias: 'snap-port',
            type: 'number',
            nargs: 1,
            default: 6969,
            describe: 'Set the Poppy snap server port.'
        }
    },
    save_config: {
        key: 's',
        details: {
            alias: 'save',
            type: 'boolean',
            default: false,
            describe: 'Save settings to a local .poppyrc file'
        }
    },
    motor_conf: {
        key: 'M',
        details: {
            alias: 'motor-configuration',
            type: 'boolean',
            default: false,
            describe: 'Display motor configuration.'
        }
    },
    discover: {
        key: 'D',
        details: {
            alias: 'discover',
            type: 'boolean',
            default: 'false',
            describe: 'Discover the poppy robot motors.'
        }
    },
    all: {
        key: 'a',
        details: {
            alias: 'all',
            type: 'boolean',
            default: false,
            describe: 'Include details about motors (angle limits)'
        }
    },
    validate: {
        key: 'v',
        details: {
            alias: 'validate',
            type: 'boolean',
            default: 'false',
            describe: 'Check if the current used robot descriptor matches with the target Poppy.'
        }
    },
    save_descriptor: {
        key: 'S',
        details: {
            alias: 'Save',
            type: 'string',
            nargs: 1,
            describe: 'Save discovered configuration to a descriptor file.'
        }
    }
};

//////////////////////////////////
// Utility functions
//////////////////////////////////

const getPoppyConfiguration = (argv) => {
    
    let config = {connect: {}};

    let ckeys = { // FIXME use _OPTIONS...
        'ip': { flags: ['i', 'ip'], default: 'poppy.local'},
        'httpPort': { flags: ['p', 'httpPort', 'http-port'], default: 8080},
        'snapPort': { flags: ['P', 'snapPort', 'snap-port'], default: 6969}
    };

    let tr = (tgt, src, fromCli = true) => { // arf...
        for( let k in ckeys ) {

            let flags = ckeys[k].flags;
            let v = flags.find( elt => undefined != src[elt]);

            if (v) {
                if (fromCli) {
                    let isDefault = src[v] === ckeys[k].default;
                    if ( isDefault ) {
                        let isSetFromCLI = process.argv // ensure it comes from cli, not default from yargs...
                            .slice(2) // not relevant
                            .map( elt => elt.replace(/^[-]+/, '') ) // remove '-', '--'
                            .some( elt => flags.includes(elt) ) // check if found
                        ;
                        if ( isSetFromCLI ) {
                            delete tgt[k]; // Remove it...
                        }
                    } else {
                        tgt[k] = src[v]; // ...Affect it
                    }
                } else { // we take everyting from the .poppyrc file
                    tgt[k] = src[v];
                }
            }
        }
    };

    //
    // First, let read configuration from local .poppyrc file, if any
    //
    try {
        let configFile = path.resolve(process.cwd(), '.poppyrc');
        let poppyrc = JSON.parse(fs.readFileSync(configFile, 'utf8'));
        // Connexion settings
        tr(config.connect, poppyrc.connect || {}, false);
        // Robot descriptor
        if (poppyrc.descriptor) {
            config.descriptor = poppyrc.descriptor;
        }

    } catch(error) {
       //Does nothing
    }

    // On a second hand, let's obtain settings from the cli.
    // Note Poppy configuration is called before initializing the yargs context
    // in CLI mode...

    tr(config.connect, argv);

    return config;
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