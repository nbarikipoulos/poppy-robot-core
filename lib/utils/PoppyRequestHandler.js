/*! Copyright (c) 2018-2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

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
 * @memberof module:poppy-robot-core
 * @inner
 * @category Typedefs
 */

/**
 * Response object that handles result of requests to the pypot http server
 * embedded in poppy Robot. 
 * 
 * This object is composed of properties with names and values 
 * respectively set with the register name and the returned value.
 * More details available [here](https://github.com/poppy-project/pypot/blob/master/REST-APIs.md)
 * about the REST API of the pypot http server.
 * 
 * @typedef ResponseObject
 * @type Object
 * @property {string|integer|boolean} `$registerName` - a property set to the queried register.
 * @memberof module:poppy-robot-core
 * @inner
 * @category Typedefs
 */

const axios = require('axios');

/**
 * Class in charge of the requests to the Poppy Robot.
 * 
 * It allow requesting the rest APIs exposed by both http and snap server
 * served by the Poppy robot.
 * @memberof module:poppy-robot-core
 * @inner
 */
class PoppyRequestHandler {

    /**
     * Instantiate a new Poppy Request Handler.
     * 
     * Default instantiation will use the default poppy ergo jr connection
     * settings.
     * 
     * @param {module:poppy-robot-core~ConnectionSettings=} connect - connection settings
     * @example
     *  const ReqHandler = require('poppy-robot-core').PoppyRequestHandler;
     * 
     *  let req = new ReqHandler(); // Default settings _i.e._ a Poppy Ergo Jr
     *  // with hostname and http port respectively set to 'poppy.local' and 8080.
     *  
     *  req = reg.setMotorRegister('m1', 'moving_speed', '100'); // will
     *  // set the 'moving_speed' register of motor 'm1' to 100.
     * 
     *  //...
     * 
     *  req.getMotorRegister('m1', 'present_position'); // will return
     *  // a promise with result as:
     *  // {'present_position': 15}
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
     * @return {module:poppy-robot-core~ConnectionSettings}
     */
    getSettings() {
        return this._settings;
    }

    /**
     * Either 'http' (default) or 'snap'
     * @private
     */
    _getBase(type = 'http') {
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
     * @param {string} data - **data as string**
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

        return await this._getBase()[method](url, data);
    }

    /**
     * (__async method__)
     * Get value of a given register for a given motor.
     * @param {string} motor_name  - motor name/id
     * @param {string} register_name  - register name
     * @return {Promise.<module:poppy-robot-core~ResponseObject>}
     * @example 
     *  const ReqHandler = require('poppy-robot-core').PoppyRequestHandler;
     * 
     *  let req = new ReqHandler();
     *  
     *  req.getMotorRegister('m1', 'present_position'); // will return
     *  // a promise with result as:
     *  // {'present_position': 15}
     */
    async getMotorRegister(motor_name, register_name) {

        let [url, method] = _getRelativeURL(
            'get_register',
            {
                motor_name,
                register_name
            }
        );

        return (await this._getBase()[method](url)).data;
    }

    /**
     * (__async method__)
     * Get the aliases of the Poppy Robot.
     * 
     * Return an array containing the alias name/ids.
     * @return {Promise.<Array.<string>>}
     */
    async getAliases() {
        let [url, method] = _getRelativeURL(
            'aliases'
        );

        return (await this._getBase()[method](url)).data;
    }

    /**
     * (__async method__)
     * Get the motor of a given alias.
     * 
     * Return an array that contains the motor name/ids.
     * @param {string} alias  - alias name/id
     * @return {Promise.<Array.<string>>}
     */
    async getAliasMotors(alias) {
        let [url, method] = _getRelativeURL(
            'motors',
            {alias}
        );

        return (await this._getBase()[method](url)).data;
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

    return await this._getBase('snap')[method](url);
}

/////////////////////////
/////////////////////////
// Public API
/////////////////////////
/////////////////////////

module.exports = PoppyRequestHandler;