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

const Motor = require('./motor/ExtMotorRequest');

const RequestHandler = require('./utils/PoppyRequestHandler');
const readDescriptor = require('./utils/descriptor').read;

/**
 * The main object of the module.
 * The poppy object handles:
 * - The robot descriptor aka the aliases and motors configuration,
 * - The requesting object to the robot,
 * - At last the script execution engine.
 * 
 * Note contrary to instantiating through the factory P.createPoppy, it does not automatically
 * take into account settings of the .poppyrc file or passed through the CLI
 * @memberof module:poppy-robot-client
 * @inner
 * @example
 * const Poppy = require('poppy-robot-client').Poppy; 
 * 
 * let poppy = new Poppy(); // create a poppy object
 *                              // using default settings for a Poppy Ergo Jr.
 * 
 * let anotherPoppy = new Poppy({ // Another Poppy Ergo Jr...
 *      connect : { // ...with custom connection settings: 
 *          ip: poppy1.local // hostname set to poppy1.local
 *          httpPort: 8081   // and http server on port 8081
 *      }
 * });
 */
class Poppy {

    /**
     * Instantiate a new Poppy object.
     *  Note Intantitating a poppy object without any settings will use ones
     * by default for a poppy ergo jr,
     * @param {Object=} options - settings object
     * @param {module:poppy-robot-client~DescriptorLocator=} options.descriptor - Descriptor locator
     * @param {module:poppy-robot-client~ConnectionSettings=} options.connect - Connection Settings to Poppy
     */
    constructor({
        descriptor, // A descriptor locator (see utils/descriptor)
        connect // Connection Settings
    } = {}) {

        this._descriptor = undefined; // descriptor
        this._requestHandler = undefined; // request handler

        // Init the Robot context
        this._init(descriptor, connect);

        //Store the configuration
        this._config = Object.assign(
            {},
            {descriptor, connect}
        );

    }

    /**
     * Accessor config object passed at instantiation __i.e.__
     * without defaut values
     * @return {Object}
     */
    getConfig() { return this._config;}

    /**
     * Accessor on the descriptor handled
     * @return {Object}
     */
    getDescriptor() { return this._descriptor;}

    /**
     * Return a list containing all motor ids
     * @return {Array.<string>}
     */
    getAllMotorIds() { return [].concat(...this._all);}

    /**
     * Accessor on the motor Object with id 'id'
     * @param {string} id - motor name/id 
     * @return {module:poppy-robot-client~RawMotorRequest}
     */
    getMotor(id) { return this[id];}

    /**
     * (__async method__)
     * Execute Scripts
     * @param {...module:poppy-robot-client~Script} scripts - The scripts to execute
     * @return {Promise.<null>}
     */
    async exec(...scripts) {
        await scripts.reduce( (acc, sc) => acc.then( _ => this._exec(sc))
        ,Promise.resolve(null));

        return this;
        
    }

    async _exec(script) {

        let actionHandlers = script._actionHandlers;

        // Transform Script objects to an array of object of kind
        // { motor, id, values }
        let elements = [].concat(...actionHandlers.map( aHandler => {

            // The target motors
            let motors = 'all' === aHandler.getMotors()[0]?
                this._all:
                aHandler.getMotors()
            ;

            let actions = aHandler.getActions();

            return [].concat(...actions.map( action => {
                let result;
                if ( 'wait' === action.id ) { // 'wait' action will only apply once,
                                              // not on every selected motors
                    result = [].concat({
                        motor: this._all[0],
                        id: action.id,
                        values: action.values
                    });
                } else {
                    result = motors.map( motor => ({
                        motor,
                        id: action.id,
                        values: action.values
                    }));
                }
                return result;
            }
                
            ));
        }));

        // The execution stage itself
        return elements.reduce( (acc, current) =>
            acc.then( _ => this[current.motor][current.id](...current.values) )
                .catch( err => console.log(err) )
            ,Promise.resolve(null)
        );
    }

    _init(descriptor, connexionSettings) {

        // First, let instantiate a request handler for this poppy...
        this._requestHandler = new RequestHandler(
            connexionSettings
        );

        // On a second hand, let's obtain the descriptor
        try {
            this._descriptor = readDescriptor(descriptor);
        } catch(error) {
            throw error;
        }

        // At last, let init the motors

        let motors = this._descriptor.motors;

        this._all = [];

        motors.forEach(motor => {
            this._all.push(motor.name); // Store all the motor ids
            // "Instantiate" a Motor object and reference it to a new attribute motor.name (aka id)
            this[motor.name] = new Motor(
                motor,
                this._requestHandler
            );
        });
    }

}

/////////////////////////
/////////////////////////
// Public API
/////////////////////////
/////////////////////////

module.exports = Poppy;
