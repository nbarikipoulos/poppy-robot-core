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

const Script = require('../lib/Script');

//////////////////////////////////
//////////////////////////////////
// Public API
//////////////////////////////////
//////////////////////////////////

module.exports = (yargs, helper) => yargs.command(
    'exec',
    `Execute command on Poppy. Type $0 exec <command> -h for help on each command.`,
    (yargs) => {
        _helper = helper;

        COMMANDS.forEach( cmd => yargs.command(
            cmd.name,
            cmd.desc,
            cmd.options,
            cmd.exec
        ));

        yargs.demandCommand(1, 'Use at least one command');
    }
);

//////////////////////////////////
//////////////////////////////////
// Private
//////////////////////////////////
//////////////////////////////////

// ...
let _helper = undefined;

//////////////////////////////////
// Execute simple command
//////////////////////////////////

async function exec(type, motors, options) {
    let values = Object.values(options).map(val => {
        if ( 'compliant' === type ) { // arf...
            if ( 'on' === val ) return true;
            if ( 'off' === val) return false;
        }
        return val
    });

    //
    // create a poppy script...
    //

    let script = new Script()
        .select(...motors)    
    ;

    script[type].call(script,...values);

    //
    // ... and execute it
    //
    let poppy = _helper.poppy;
    poppy.exec(script);

}

//////////////////////////////////
// Command "descriptors"
//////////////////////////////////

const COMMANDS = [{
    name: 'compliant',
    desc: 'Set the compliant state of the selected motor(s)',
    options: (yargs) => {

        _toCmdOptions(yargs, ['motor', 'compliant']);

        yargs
            .strict()
            .example(
                `$0 exec compliant`,
                'Switch all motors compliant state to \'false\' i.e. motors are addressable.'
            )
            .example(
                `$0 exec compliant -v off`,
                'Switch all motors compliant state to \'false\' i.e. motors are addressable.'
            )
            .example(
                `$0 exec compliant -v on`,
                'Switch all motors compliant state to \'true\' i.e. motors are not addressable.'
            )
        ;
    },
    exec: (argv) => exec('compliant', argv.motor, { compliant: argv.value})
},{
    name: 'speed',
    desc: 'Set the rotation speed of the selected motor(s).\n'
        + 'Value must be in the [0, 1023] range',
    options: (yargs) => {
        
        _toCmdOptions(yargs, ['motor', 'speed'], 'speed');

        yargs
            .example(
                `$0 exec speed -v 100`,
                'Set the rotation speed of all motors to 100 (slower).'
            )
            .example(
                `$0 exec speed -m m1 m2 -v 500 (quicker)`,
                'Set the rotation speed of the motors m1 and m2 to 500 (quicker).'
            )
        ;
    },
    exec: (argv) => exec('speed', argv.motor, { speed: argv.value })
},{
    name: 'rotate',
    desc: 'Rotate the target motor(s) by x degrees',
    options: (yargs) => {
        
        _toCmdOptions(yargs, ['motor', 'rotate', 'wait'], 'rotate');

        yargs
            .example(
                `$0 exec rotate -m m1 m2 -v -30 -w`,
                'Rotate the motors m1 and m2 by -30 degrees and wait until each motors will reach its new position.'
            )
        ;
    },
    exec: (argv) => exec('rotate', argv.motor, { angle: argv.value, wait: argv.wait})
},{
    name: 'position',
    desc: 'Set the target position of the selected motor(s)',
    options: (yargs) => {

        _toCmdOptions(yargs, ['motor', 'position', 'wait'], 'position');

        yargs
            .example(
                `$0 exec position -m m1 m2 -v 0 -w`,
                'Move the motors m1 and m2 to the 0 degree position and wait until each motors will reach its new position.'
            )
        ;
    },
    exec: (argv) => exec('position', argv.motor, { position: argv.value, wait: argv.wait})
},{
    name: 'led',
    desc: 'Set the led of the selected motor(s)',
    options: (yargs) => {
        
        _toCmdOptions(yargs, ['motor', 'led']);

        yargs
            .example(
                `$0 exec led`,
                'Turn off the led of all motors.'
            )
            .example(
                `$0 exec -m m3 led -v green`,
                'Set the led color of motor \'m3\' to \'green\'.'
            )
        ;
    },
    exec: (argv) => exec('led', argv.motor, { led: argv.value})
}];

//////////////////////////////////
// misc.
//////////////////////////////////

let _toCmdOptions = (yargs, optionsKeys, ...mandatoryOptionsKeys) => {
    _helper.optionHelper.addOptions(
        yargs,
        'Command Options:',
        optionsKeys,
        ...mandatoryOptionsKeys
    );
    _helper.optionHelper.addPoppyConfigurationOptions(yargs);
}