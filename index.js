/*! Copyright (c) 2018-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

/**
 * This module is the main entry point for poppy robot core.
 * As user facing module, It exports the poppy-robot-core primary
 * public API and provides convenience accessors to certain sub-modules.
 *
 * The poppy-robot-core is mainly based on the following objects:
 * - The Poppy object which handles:
 *      - The robot configuration and then, the motors objects,
 *      - The script execution engine.
 * - The Motor Objects:
 *      - ExtMotorRequest which handles high level actions of the motors,
 *      - RawMotorRequest which handles the low-level rest requests to the motor registers.
 * - The RequestHandlerObject object in charge of all the requests the REST API,
 * - The Script object in order to develop scripts.
 *
 * Furthermore it exposes a bunch of utility functions such as factories
 *  for "high-level" objects _i.e._ Script and Poppy ones
 *  or discovering robot utility, etc...
 *
 * @module poppy-robot-core
 * @typicalname P
 * @version 9.0.0
 */

'use strict'

const Poppy = require('./lib/Poppy')

const ExtMotorRequest = require('./lib/motor/ExtMotorRequest')
const RawMotorRequest = require('./lib/motor/ExtMotorRequest')
const PoppyRequestHandler = require('./lib/utils/PoppyRequestHandler')
const { createDescriptor } = require('./lib/utils/descriptor-factory')

const Script = require('./lib/script/Script')

const { createPoppy, createScript } = require('./lib/poppy-utils')

const DEFAULT_CONNECTION_SETTINGS = require('./lib/utils/default-settings')

// ////////////////////////////////
// ////////////////////////////////
// Public API
// ////////////////////////////////
// ////////////////////////////////

module.exports = {
  createPoppy,
  createScript,
  createDescriptor,
  Script,
  Poppy,
  ExtMotorRequest,
  RawMotorRequest,
  PoppyRequestHandler,
  DEFAULT_CONNECTION_SETTINGS
}
