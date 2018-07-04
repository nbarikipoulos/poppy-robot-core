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

const Script = require('../index').Script;

const cliOptions = require('./cli-options'),
    EPILOGUE = cliOptions.EPILOGUE
;

//////////////////////////////////
//////////////////////////////////
// Public API
//////////////////////////////////
//////////////////////////////////

module.exports = (yargs, poppy) => yargs.command(
    'init',
    'Init the Poppy robot next to its power up.',
    (yargs) => {
        yargs.strict()
            .example(
                `$0 init`,
                'Initialize the Poppy robot next to its power up.'
            )
            .epilogue(EPILOGUE);
        ;
    },
    argv => init(poppy) // Main job
);

//////////////////////////////////
//////////////////////////////////
// Private
//////////////////////////////////
//////////////////////////////////

//////////////////////////////////
// The init command itself
//////////////////////////////////

const init = async (poppy) => {

    //
    // The First request on the http server systematically fails.
    // So, let perform a dummy one on the first registered motor.
    //

    let motor = poppy[poppy.getAllMotorIds()[0]];
    try {
        await motor.get(motor._motor.name, 'compliant')
    } catch(e) {}

}
