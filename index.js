/**
 * This module is the main entry point for poppy robot core.
 * As user facing module, It exports the poppy-robot-core primary
 * public API and provides convenience accessors to certain sub-modules.
 *
 * The poppy-robot-core module is mainly based on the following objects:
 * - The Poppy object that handles:
 *      - The robot configuration (its structure, connection settings) and motor objects,
 *      - A script execution engine in order to perform actions on motors.
 * - The Motor Objects:
 *      - ExtMotorRequest that handles high-level actions on motors,
 *      - RawMotorRequest that handles the low-level requests to the motor registers.
 * - At last, the PoppyRequestHandler object in charge of all the requests to the pypot REST API.
 *
 * Furthermore, it exposes a bunch of high-level factories in order to ease use of
 *  these objects such as settings connection parameters, automatically perform a live discovering
 *  of the target robot, and so on.
 *
 * @module poppy-robot-core
 * @typicalname P
 * @version 11.1.0
 */

'use strict'

const { Poppy } = require('./lib/poppy')
const { ExtMotorRequest, RawMotorRequest } = require('./lib/motor')
const { PoppyRequestHandler, getConfig, DEFAULT_SETTINGS } = require('./lib/request')
const { Script } = require('./lib/script')
const { createPoppy, createScript, createDescriptor, createRequestHandler } = require('./lib/factories')

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  createPoppy,
  createScript,
  createRequestHandler,
  createDescriptor,
  Script,
  Poppy,
  ExtMotorRequest,
  RawMotorRequest,
  PoppyRequestHandler,
  getConfig,
  DEFAULT_SETTINGS
}
