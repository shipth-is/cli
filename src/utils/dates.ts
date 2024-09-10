import {DateTime} from 'luxon'

// Converts the attributes of apiObject which are in the keys array to DateTime
export function castObjectDates<T>(apiObject: any, keys = ['createdAt', 'updatedAt']) {
  if (!apiObject) return apiObject as T
  const datesOnly = Object.keys(apiObject)
    .filter((k) => keys.includes(k))
    .reduce((a: any, c: string) => {
      a[c] = DateTime.fromISO(apiObject[c])
      return a
    }, {})
  return {
    ...apiObject,
    ...datesOnly,
  } as T
}

// Converts the attributes of each object in apiArray which are in the keys array to DateTime
export function castArrayObjectDates<T>(apiArray: any[], keys = ['createdAt', 'updatedAt']) {
  return apiArray.map((apiObject) => castObjectDates<T>(apiObject, keys))
}
