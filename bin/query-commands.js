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

const Table = require('cli-table');

const cliOptions = require('./cli-options'),
    initCLIOptions = cliOptions.init,
    EPILOGUE = cliOptions.EPILOGUE
;

//////////////////////////////////
//////////////////////////////////
// Public API
//////////////////////////////////
//////////////////////////////////

module.exports = (yargs, helper) => yargs.command(
    'query',
    'Query the state of Poppy motors.',
    (yargs) => {
        let optionHelper = helper.optionHelper;

        optionHelper.addOptions(
            yargs,
            'Query Options:',
            ['motor', 'register', 'invert']
        );
        optionHelper.addPoppyConfigurationOptions(yargs);

        yargs
            .example(
                `$0 query -r compliant`,
                'Get the \`compliant\` register value of all motors'
            )
            .example(
                `$0 query -m m1 m6 -r present_position upper_limit`,
                'Get the \`present_position\` and \'upper_limit\' register values of motors m1 and m6'
            )
        ;
    },
    (argv) => query(argv, helper.poppy) // Main job
);

//////////////////////////////////
//////////////////////////////////
// Private
//////////////////////////////////
//////////////////////////////////

//////////////////////////////////
// The query command itself
//////////////////////////////////

const query = async (argv, poppy) => {

    let motors = argv.motor.includes('all') ?
        poppy.getAllMotorIds():
        argv.motor
    ;

    let registers = argv.register;

    //
    // Get data...
    //

    let result = await _query(poppy, motors, registers);

    //
    // ...And display them
    //

    let display = argv.i ?
        {
            rows: motors, 
            cols: registers,
            cb: (row) => {
                let o = {};
                o[row] = Object
                    .values(
                        result.find( obj => row === obj.motor )
                    )
                    .slice(1) // motor attribute
                    .map(v => _format(v)) // other attributes are register values
                ;
                return o;
            }
        }:
        {
            rows: registers, 
            cols: motors,
            cb: (row) => {
                let o = {};
                o[row] = result.map( res => _format(res[row]) );
                return o;
            }
        }
    ;

    let table = new Table({
        head: [].concat('', ...display.cols)
    });

    for (let row of display.rows) {
        table.push(
            display.cb.call(null,row)
        )
    }

    // At last, let's display the result
    
    console.log(
        table.toString()
    );
  }

const _query = async (poppy, motors, registers) => {

    let res = [];

    for(let motor of motors) {        
        let data = (await Promise.all(
            registers.map( async register => 
                // We only use the RawMotorRequest prototype which could be 
                // directly call without Poppy.
                await poppy[motor].get(motor, register)
            )
        )).reduce( (acc, obj) =>
            Object.assign(acc, obj),
            {motor}
        );
        res.push(data);
    }

    return res;
  }


//////////////////////////////////
// misc.
//////////////////////////////////

let _format = value => ( !isNaN(parseFloat(value)) ^ !Number.isInteger(value) ) ?
    value: // String, Boolean, Integer
    Number(value).toFixed(1) // Float: 1 significant digit is enough
;
