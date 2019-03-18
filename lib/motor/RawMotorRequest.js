/*! Copyright (c) 2018 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

/**
 * Motor Descriptor.
 *
 * @typedef MotorDescriptor
 * @type Object
 * @property {string} name - name/id of the motor
 * @property {int} lower_limit - lower angle boundary of the motor
 * @property {int} upper_limit - upper angle boundary of the motor
 * @memberof module:poppy-robot-client
 * @inner
 * @category Typedefs
 */


/**
 * Class handling the primary requests to a Poppy motor _i.e._ the motor registry accesses.
 *
 * @see {@link module:poppy-robot-client~PoppyRequestHandler}
 * @memberof module:poppy-robot-client
 * @inner
 */
class RawMotorRequest {

    /**
     * Instantiate a new raw motor object.
     * @param {module:poppy-robot-client~MotorDescriptor} - motor descriptor 
     * @param {module:poppy-robot-client~PoppyRequestHandler} requestHandler - Poppy request handler object
     */
    constructor(motor, requestHandler) {
        this._motor = motor;
        this._reqHandler = requestHandler;
    }

    /**
     * Get the motor name/id.
     * @return {string}
     */
    getName() { return this._motor.name; }

    /**
     * (__async method__)
     * Set a register of the motor to a given value.
     * 
     * Not it must not be used for the led registry 
     * (see dedicated method.)
     * @param {string} register_name  - register name
     * @param {string} data - data as string
     * @return {Promise.<null>}
     */
    async set(register_name, data) {
        return await this._reqHandler.setMotorRegister(
            this._motor.name,
            register_name,
            data
        );
    }

    /**
     * (__async method__)
     * Get value of a given register.
     * @param {string} register_name  - register name
     * @return {Promise.<ResponseObject>}
     */
    async get(register_name) {
        return await this._reqHandler.getMotorRegister(
            this._motor.name,
            register_name
        );
    }

    /**
     * (__async method__)
     * Set the led register.
     * @param {'off'|'red'|'green'|'blue'|'yellow'|'cyan'|'pink'|'white'} color  - register name
     * @return {Promise.<null>}
     */
    async led(color) {
        return await this._reqHandler.led(
            this._motor.name,
            color
        );
    }

    /**
     * Get the allowed values for the led register.
     * @return {Array.<string>}
     */
    getLedValues() {
        return [].concat(..._LED_VALUES);
    }

}

const _LED_VALUES = [
    'off',
    'red',
    'green',
    'blue',
    'yellow',
    'cyan',
    'pink',
    'white'
];

/////////////////////////
/////////////////////////
// Public API
/////////////////////////
/////////////////////////

module.exports = RawMotorRequest;