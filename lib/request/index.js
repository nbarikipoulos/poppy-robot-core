/*! Copyright (c) 2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const PoppyRequestHandler = require('./PoppyRequestHandler')
const { getSettings, DEFAULT_CONNECTION_SETTINGS } = require('./settings')

module.exports = {
  PoppyRequestHandler,
  getSettings,
  DEFAULT_CONNECTION_SETTINGS
}
