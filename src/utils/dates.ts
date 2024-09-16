import {DateTime} from 'luxon'

export const DEFAULT_LOCALE = 'en-US'

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

export function getDateLocale() {
  const fallback = Intl.DateTimeFormat().resolvedOptions().locale.replace(/_/g, '-') || DEFAULT_LOCALE
  try {
    const env = process.env
    const fullLocale = env.LC_TIME || env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES
    const shortLocale = fullLocale?.split('.')[0].replace(/_/g, '-')
    const finalLocal = shortLocale || fallback
    // Check it doesn't throw an error
    const tstConvert = DateTime.now().toLocaleString(DateTime.DATE_SHORT, {locale: finalLocal})
    return finalLocal
  } catch (e) {
    return fallback
  }
}

export function getShortDate(inputDate: DateTime) {
  const locale = getDateLocale()
  return inputDate.toLocaleString(DateTime.DATE_SHORT, {locale})
}

export function getShortDateTime(inputDate: DateTime) {
  const locale = getDateLocale()
  return inputDate.toLocaleString(DateTime.DATETIME_SHORT, {locale})
}

export function getShortTimeDelta(start: DateTime, end: DateTime): string {
  return end.diff(start).rescale().set({milliseconds: 0}).shiftTo('minutes', 'seconds').toHuman({
    listStyle: 'short',
    unitDisplay: 'short',
  })
}
