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

const fs = require('fs');
const path = require('path');

const colors = require('colors');

//////////////////////////////////
//////////////////////////////////
// Public API
//////////////////////////////////
//////////////////////////////////

module.exports = (yargs, helper) => yargs.command(
    'init',
    'Init/Configure the Poppy robot.',
    (yargs) => {
        yargs
            .example(
                `$0 init`,
                'Initialize the Poppy robot next to its power up.'
            )
        ;
        helper.optionHelper.addPoppyConfigurationOptions(yargs); // Poppy conf options
        helper.optionHelper.addOptions( // add save option
            yargs,
            'Poppy Configuration Options:',
            ['save_config']);
    },
    argv => init(helper.poppy, argv.save) // Main job
);

//////////////////////////////////
//////////////////////////////////
// Private
//////////////////////////////////
//////////////////////////////////

//////////////////////////////////
// The init command itself
//////////////////////////////////

const init = async (poppy, save) => {

    let dummyHttpRequest = async _ => {
        let result = true;
        let motor = poppy[poppy.getAllMotorIds()[0]];
        try {
            await motor.get(motor._motor.name, 'compliant')
        } catch(e) { result = false;}
        return result;
    }

    let ledSnapRequest = async _ => {
        let result = true;
        let motor = poppy[poppy.getAllMotorIds()[0]];
        try {
            await motor.led(motor._motor.name, 'off')
        } catch(e) { result = false;}
        return result;
    }

    //
    // The First request on the http server systematically fails.
    // So, let perform a dummy one on the first registered motor.
    //

    let t = (res) => res ?
        colors.green.inverse('OK'):
        colors.red.inverse('KO')
    ;

    dummyHttpRequest(); // First "dummy" request

    let config = poppy.getConfig();
    let connect = config.connect;

    let res = await dummyHttpRequest(); // Next must succeed
    console.log(`Connexion to Poppy (hostname/ip: ${connect.ip})`);
    console.log(`> Http server (port ${connect.httpPort}):\t` + t(res));
    // Test the snap server with led set`
    res = await ledSnapRequest();
    console.log(`> Snap server (port ${connect.snapPort}):\t` + t(res));

    if ( save ) {
        fs.writeFileSync(
            path.resolve(process.cwd(), '.poppyrc'),
            JSON.stringify(config)
        );
    }
        
}
