/**
 * Converts an array to a dictionary (object) with the keys set to the value of
 * the key attribute.
 *
 * @param  {Object[]} array
 * @param  {String}   key
 *
 * @return {Object}
 */
export function arrayToDictionary(array: any[], key = 'id') {
  return array.reduce((a, i) => {
    a[i[key]] = i
    return a
  }, {})
}

/**
 * Does the opposite of arrayToDictionary
 *
 * @param  {Object} dictionary
 *
 * @return {Object[]}
 */
export function dictionaryToArray(dictionary: {[key: string]: any}) {
  return Object.keys(dictionary).map((key) => dictionary[key])
}
