import { DateString } from './model'

export function normalizeDate(date: string): DateString | null {
  if (!date) {
    return null
  }
  const items = date.split('-')
  if (items.length !== 3) {
    throw new Error('Wrong length')
  }
  let [day, month, year] = items
  if (year.length == 2) {
    year = '20' + year
  }
  if (year.length !== 4) {
    throw new Error(`Wrong length of year string: ${year.length}`)
  }

  if (day.length === 1) {
    day = '0' + day
  }
  if (day.length !== 2) {
    throw new Error('Wrong length of day string')
  }

  if (month.length === 1) {
    month = '0' + month
  }
  if (month.length !== 2) {
    throw new Error('Wrong length of month string')
  }

  if (parseInt(day) > 31 || parseInt(month) > 12) {
    throw new Error('Invalid value for date')
  }
  return new DateString([year, month, day].join('-'))
}
