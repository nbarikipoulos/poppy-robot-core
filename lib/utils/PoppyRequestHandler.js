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

const axios = require('axios');

class PoppyRequestHandler {

    constructor({
        schema = 'http',
        ip = 'poppy.local',
        httpPort = 8080,
        snapPort = 6969,
        timeout = 2000
    } = {}) {
        
        // Store the connexion settings
        this._settings = Object.assign({},
            {schema, ip, httpPort, snapPort, timeout}
        );

        // Init the base URLs
        this._base = {
            http: axios.create({
                baseURL: _getBaseURL(schema, ip, httpPort),
                responseType:'json',
                timeout
            }),
            snap: axios.create({
                baseURL: _getBaseURL(schema, ip, snapPort),
                responseType:'json',
                timeout
            })
        }

    }

    getCnxSettings() {
        return this._settings;
    }

    getBase(type = 'http') {
        return this._base[type];
    }

    async setMotorRegister(motor_name, register_name, data) {

        let [url, method] = _getRelativeURL(
            'set_register',
            {
                motor_name,
                register_name
            }
        );

        return await this.getBase()[method](url, data);
    }

    async getMotorRegister(motor_name, register_name) {

        let [url, method] = _getRelativeURL(
            'get_register',
            {
                motor_name,
                register_name
            }
        );

        return (await this.getBase()[method](url)).data;
    }

    async getAliases() {
        let [url, method] = _getRelativeURL(
            'aliases'
        );

        return (await this.getBase()[method](url)).data;
    }

    async getAliasMotors(alias) {
        let [url, method] = _getRelativeURL(
            'motors',
            {alias}
        );

        return (await this.getBase()[method](url)).data;
    }

}

//////////////////////////////////
// Utility functions
//////////////////////////////////

let _getBaseURL = (schema, ip, port) => `${schema}://${ip}:${port}`;

const _getRelativeURL = (
    id,
    inputParameters = {}
) => {

    let descriptor = _REST_PATHS.find( elt => id === elt.id); 

    // Check parameters, if any
    let pathParameters = descriptor.path.match(/:\w+/g) || [];

    let path = descriptor.path;
    pathParameters.forEach( param => {
        let value = inputParameters[param.slice(1)];
        if ( value ) {
            path = path.replace(param, value);
        } else {
            throw new Error(
                'Missing value for parameter \'${param}\' in url ${descriptor.path}'
            );
        }
    });

    return [path, descriptor.method];

}

const _REST_PATHS = require('../../config/rest-api.json');

//////////////////////////////////
// Hack for led which only works using the SNAP rest api.
// Led set is done through a GET method as below:
// http://poppy.local:6969/motors/set/registers/m2:led:off
//////////////////////////////////

_REST_PATHS.push({
    'id': 'snap_led',
    'category': 'motor',
    'desc': 'Get/Set the motors leds',
    'path': '/motors/set/registers/:motor_name::reg::color',
    'method': 'get'
})

PoppyRequestHandler.prototype.led = async function(motor_name, color) {

    let [url, method] = _getRelativeURL(
        'snap_led',
        {
            motor_name,
            reg: 'led',
            color   
        }
    );

    return await this.getBase('snap')[method](url);
}

/////////////////////////
/////////////////////////
// Public API
/////////////////////////
/////////////////////////

module.exports = PoppyRequestHandler;