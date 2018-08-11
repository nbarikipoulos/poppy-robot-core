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

/**
 * Connection Settings to Poppy Robot.
 *
 * @typedef ConnectionSettings
 * @type Object
 * @property {string} [schema=http] - type of request. Not intended to be changed
 * @property {string} [ip=poppy.local] - hostname/ip of the targeted Poppy robot
 * @property {int} [httpPort=8080] - port of the http port served by the Poppy robot
 * @property {int} [snapPort=6969] - port of the snap port served by the Poppy robot (used for led)
 * @property {int} [timeout=2000] - request timeout (in ms)
 * @memberof module:poppy-robot-client
 * @inner
 * @category Typedefs
 */

/**
 * Response object to any request to poppy. 
 * 
 * This object is the JSON returned by the request.
 * Consult this [page](https://github.com/poppy-project/pypot/blob/master/REST-APIs.md) which describes the REST API of the pypot http server.
 * 
 * @typedef ResponseObject
 * @type Object
 * @property {string} [register] - a property set to the queried register name
 * @property {undefined} [register.data] - value of the register
 * @memberof module:poppy-robot-client
 * @inner
 * @category Typedefs
 */

const axios = require('axios');

/**
 * Class in charge of the requests to the Poppy Robot.
 * 
 * It allow requesting the rest APIs exposed by both http and snap server
 * served by the Poppy robot.
 * @memberof module:poppy-robot-client
 * @inner
 */
class PoppyRequestHandler {

    /**
     * Instantiate a new Poppy Request Handler.
     * 
     * Default instantiation will use the default poppy ergo jr connection
     * settings.
     * 
     * @param {module:poppy-robot-client~ConnectionSettings=} connect - connection settings
     */
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

    /**
     * Return an object including the connection settings
     * @return {module:poppy-robot-client~ConnectionSettings}
     */
    getSettings() {
        return this._settings;
    }

    /**
     * FIXME Change prefix...
     * @private
     */
    getBase(type = 'http') {
        return this._base[type];
    }

    /**
     * (__async method__)
     * Set a register of a given motor with a value.
     * 
     * Not it must not be used for the led registry 
     * (see dedicated method.)
     * @param {string} motor_name  - motor name/id
     * @param {string} register_name  - register name
     * @param {string} data - data as string
     * @return {Promise.<null>}
     */
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

    /**
     * (__async method__)
     * Get value of a given register for a given motor.
     * @param {string} motor_name  - motor name/id
     * @param {string} register_name  - register name
     * @return {Promise.<ResponseObject>}
     */
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

    /**
     * (__async method__)
     * Get the aliases of the Poppy Robot.
     * 
     * Note the data of the ResponseObject will be an array containing the alias name/ids.
     * @return {Promise.<ResponseObject>}
     */
    async getAliases() {
        let [url, method] = _getRelativeURL(
            'aliases'
        );

        return (await this.getBase()[method](url)).data;
    }

    /**
     * (__async method__)
     * Get the motor of a given alias.
     * 
     * Note the data of the ResponseObject will be an array containing the motor name/ids.
     * @param {string} alias  - alias name/id
     * @return {Promise.<ResponseObject>}
     */
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

/**
 * (__async method__)
 * Set the led register of a target motor
 * @memberof PoppyRequestHandler
 * @param {string} motor_name - motor name/id
 * @param {'off'|'red'|'green'|'blue'|'yellow'|'cyan'|'pink'|'white'} color  - register name
 * @return {Promise.<null>}
 */
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