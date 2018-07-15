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

let descFolder = `${__dirname}/../../config/`;

let read = (descLocator) => {

    let descriptorFile = undefined;

    let [schema, locator] = descLocator.split('://');

    switch (schema) {
        case 'file': 
            descriptorFile = locator;
            break;
        case 'desc':
            descriptorFile = `${descFolder}/${locator}.json`;
            break;
        default:
            // No valid descriptor locator
            let message = `Invalid descriptor locator \'${descLocator}\'.\n`
                + 'Allowed formats are \'file://filepath\' or \'desc://descriptorId\'.' 
            ;
            throw new Error(message);
    }

    let descriptor = undefined;
    // Load the robot descriptor file
    try {
        descriptor = JSON.parse(
            fs.readFileSync(descriptorFile,'utf8')
        );
    } catch(error) {
        let message = `Unable to read/an error occurs reading the robot descriptor ${descriptorFile}`;
        throw new Error(message);
    }

    return descriptor;
}

/////////////////////////
/////////////////////////
// Public API
/////////////////////////
/////////////////////////

module.exports = { read };