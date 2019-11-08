/*! Copyright (c) 2019 Nicolas Barriquand <nicolas.barriquand@outlook.fr>. MIT licensed. */

'use strict'

/**
 * Convinient function to simplify call of type Promise.all( anArray.map( elt => f(elt) )
 * @param {Array.<*>} array - array of input data
 * @param {function(*):Promise<*>} cb - function applied against each array elements
 * @return {Array.<Promise>}
*/
const promiseAll = (array, cb) => Promise.all(array.map(cb))

// ///////////////////////
// ///////////////////////
// Public API
// ///////////////////////
// ///////////////////////

module.exports = {
  promiseAll: promiseAll
}
