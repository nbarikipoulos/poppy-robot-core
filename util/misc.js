/*! Copyright (c) 2019-2021 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

const dns = require('dns')

/**
 * Convinient function in order to chain promises and propagate results.
 * Default implementation will return result of promises as in an array
 * @param {Array.<Function>} promiseProvider - Providers of promises to chain.
 * @param {Function=} res - Function to propagate results.
 *  Default implementation store the result of the promises into an array.
 * @param {*} [accumulator=[]] - Initial accumulator (an empty array as default)
 * @return {Promise.<*>} - A Promise returning the accumulator when done.
 */
const chainPromises = (
  promiseProviders,
  res = (previous, current) => previous.concat(current),
  accumulator = []
) => promiseProviders.reduce(
  (acc, pProvider) => acc.then(async (result) => {
    const current = await pProvider()
    return res(result, current)
  }),
  Promise.resolve(accumulator)
)

/**
 * Resolve hostname to ip address (ipv4 only).
 * @param {String} [hostname] - the hostname to resolve
 * @return {Promise<String>}
 */
const lookUp = async (hostname) => {
  let ip

  try {
    ip = (await dns.promises.lookup(hostname, 4)).address
  } catch (err) {
    // return input hostname
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
  chainPromises,
  lookUp
}
