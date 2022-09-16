'use strict'

const dns = require('dns')

/**
 * Convinient function in order to chain promises and propagate results.
 * Default implementation will return result of promises in an array
 * @param {Array.<Function>} promiseProvider - Providers of promises to chain.
 * @param {Function=} fn - Function to propagate results between steps. Default use
 * an array as accumulator and push result inside.
 *  Default implementation store the result of the promises into an array.
 * @param {*} [accumulator=[]] - Initial accumulator (an empty array as default)
 * @return {Promise.<*>} - A Promise returning the accumulator.
 */
const chainPromises = (
  promiseProviders,
  fn = (previous, current) => previous.concat(current),
  accumulator = []
) => promiseProviders.reduce(
  (acc, pProvider) => acc.then(async (result) => {
    const current = await pProvider()
    return fn(result, current)
  }),
  Promise.resolve(accumulator)
)

/**
 * The awaiting Promise
 * @param {number} [delay] - delay in s
 * @param {*=} [res=undefined] - value to resolve
 * @return {Promise<*>} - A promise of res
 */
const wait = (delay, res) => new Promise(resolve => setTimeout(
  resolve,
  1000 * delay,
  res
))

/**
 * Resolve hostname to ip address (ipv4 only).
 * Return undefined value if unable to resolve.
 * @param {String} [hostname] - the hostname to resolve
 * @return {Promise<String>}
 */
const lookUp = async (hostname) => {
  let ip

  try {
    ip = (await dns.promises.lookup(hostname, 4)).address
  } catch (err) { /* Do nothing */ }

  return ip
}

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = {
  chainPromises,
  wait,
  lookUp
}
