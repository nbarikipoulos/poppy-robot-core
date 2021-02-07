/*! Copyright (c) 2018-2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

/**
 * This module is the main entry point for poppy robot core.
 * As user facing module, It exports the poppy-robot-core primary
 * public API and provides convenience accessors to certain sub-modules.
 *
 * The poppy-robot-core is mainly based on the following objects:
 * - The Poppy object that handles:
 *      - The robot configuration and then, the motors objects,
 *      - The script execution engine.
 * - The Motor Objects:
 *      - ExtMotorRequest that handles high level actions of the motors,
 *      - RawMotorRequest that handles the low-level rest requests to the motor registers.
 * - The RequestHandlerObject object in charge of all the requests the REST API,
 * - The Script object in order to develop scripts.
 *
 * Furthermore it exposes a bunch of utility functions such as factories
 *  for "high-level" objects _i.e._ Script and Poppy ones
 *  or discovering robot utility, etc...
 *
 * @module poppy-robot-core
 * @typicalname P
 * @version 10.0.0
 */

'use strict'

const { Poppy } = require('./lib/poppy')
const { ExtMotorRequest, RawMotorRequest } = require('./lib/motor')
const { PoppyRequestHandler, getSettings, DEFAULT_CONNECTION_SETTINGS } = require('./lib/request')
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
  getSettings,
  DEFAULT_CONNECTION_SETTINGS
}
