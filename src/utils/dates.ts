import {DateTime, DateTimeFormatOptions} from 'luxon'

export const DEFAULT_LOCALE = 'en-US'

/**
 * Converts specific attributes of an object into DateTime instances.
 * The attributes to be converted are specified in the `keys` array.
 */
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

/**
 * Converts specific attributes of each object in an array into DateTime instances.
 */
export function castArrayObjectDates<T>(apiArray: any[], keys = ['createdAt', 'updatedAt']) {
  return apiArray.map((apiObject) => castObjectDates<T>(apiObject, keys))
}

/**
 * Attempts to determine the correct locale for formatting dates, based on environment variables.
 * If no valid locale is found, or if an error occurs, it falls back to the default 'en-US' locale.
 * This function needs testing in different locales and environments to ensure accuracy.
 */
export function getDateLocale() {
  const fallback = Intl.DateTimeFormat().resolvedOptions().locale.replace(/_/g, '-') || DEFAULT_LOCALE
  try {
    const env = process.env
    const fullLocale = env.LC_TIME || env.LANG || env.LANGUAGE || env.LC_ALL || env.LC_MESSAGES
    const shortLocale = fullLocale?.split('.')[0].replace(/_/g, '-')
    const finalLocal = shortLocale || fallback
    // Check it doesn't throw an error
    const _ = DateTime.now().toLocaleString(DateTime.DATE_SHORT, {locale: finalLocal})
    return finalLocal
  } catch (e) {
    return fallback
  }
}

/**
 * Formats a DateTime object into a short date string, based on the current locale.
 */
export function getShortDate(inputDate: DateTime) {
  const locale = getDateLocale()
  return inputDate.toLocaleString(DateTime.DATE_SHORT, {locale})
}

/**
 * Formats a DateTime object into a short date and time string, based on the current locale.
 * Extra formatting options can be provided to customize the output.
 */
export function getShortDateTime(inputDate: DateTime, extraFormatOpts: DateTimeFormatOptions = {}) {
  const locale = getDateLocale()
  const formatOpts = {...DateTime.DATETIME_SHORT, ...extraFormatOpts}
  return inputDate.toLocaleString(formatOpts, {locale})
}

/**
 * Formats a DateTime object into a short time string, based on the current locale.
 * Extra formatting options can be provided to customize the output, including fractional seconds.
 */
export function getShortTime(
  inputDate: DateTime,
  extraFormatOpts: DateTimeFormatOptions = {fractionalSecondDigits: 3},
) {
  const locale = getDateLocale()
  const formatOpts = {...DateTime.TIME_24_WITH_SECONDS, ...extraFormatOpts}
  return inputDate.toLocaleString(formatOpts, {locale})
}

/**
 * Calculates the time difference between two DateTime objects and returns it as a human-readable string.
 * The difference is rescaled and rounded to minutes and seconds.
 */
export function getShortTimeDelta(start: DateTime, end: DateTime): string {
  return end.diff(start).rescale().set({milliseconds: 0}).shiftTo('minutes', 'seconds').toHuman({
    listStyle: 'short',
    unitDisplay: 'short',
  })
}
