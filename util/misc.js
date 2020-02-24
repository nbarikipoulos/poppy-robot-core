/*! Copyright (c) 2019-2020 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const dns = require('dns')

const DEFAULT_SETTINGS = require('../lib/utils/default-settings')

/**
 * Convinient function to simplify call of type Promise.all( anArray.map( elt => f(elt) )
 * @param {Array.<*>} array - array of input data
 * @param {function(*):Promise<*>} cb - function applied against each array elements
 * @return {Array.<Promise>}
*/
const promiseAll = (array, cb) => Promise.all(array.map(cb))

/**
 * Resolve adress ending with '.local' _i.e._ allow to get the
 * ip of robot from its zeroconf hostname.
 * It does nothing and simply returns the input parameter if not ending with '.local'
 * @param {String} [hostname=poppy.local] - the hostname to resolve
 * @return {Promise<String>}
 */
const lookUp = async (hostname = DEFAULT_SETTINGS.ip) => {
  if (!hostname.endsWith('.local')) { // Early exit
    return hostname
  }

  let ip

  try {
    ip = (await dns.promises.lookup(hostname, 4)).address
  } catch (err) {
    // return hostname
    ip = hostname
  }

  return ip
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = {
  promiseAll,
  lookUp
}
