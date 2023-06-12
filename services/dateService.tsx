import moment from 'moment'

export const safeDate = (date: Date | string) => {
  if (typeof date === 'string') return new Date(date)
  return date
}

export const todayToSimple = () => {
  const date = new Date()
  return date.toDateString()
}

export const dateStringToPerformancePair = (dateString: string) => {
  const datePart = dateString.split('T')[0]
  const timePart = dateString.split('T')[1]

  const defaultDatePart = '1970-01-01'

  return {
    Time: new Date(`${defaultDatePart} ${timePart}`),
    Date: new Date(`${datePart}`)
  }
}

export const dateToSimple = (dateToFormat: Date | string) => {
  if (!dateToFormat) return 'DD/MM/YYYY'
  const date = safeDate(dateToFormat)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', day: '2-digit', month: '2-digit', timeZone: 'UTC' }
  return date.toLocaleDateString('en-GB', options)
}

export const dateToPicker = (dateToFormat: Date | string) => {
  if (!dateToFormat) return ''
  return typeof dateToFormat === 'object' ? dateToFormat.toISOString().slice(0, 10) : dateToFormat.slice(0, 10)
}

export const dateTimeToTime = (dateToFormat) => {
  return moment(dateToFormat).format('HH:mm')
}

export const toISO = (date) => {
  return date.toISOString()
}

export const toSql = (date) => {
  return date.slice(0, 10)
}

export const getDateDaysAgo = (date, daysToSubtract) => {
  date = new Date(date)
  return moment(date, 'dd/mm/yyyy').subtract(daysToSubtract, 'days')
}

export const getDateDaysInFuture = (date, daysToSubtract) => {
  date = new Date(date)
  return moment(date, 'dd/mm/yyyy').add(daysToSubtract, 'days')
}

export const getWeekDay = (dateToFormat: Date | string) => {
  const date = safeDate(dateToFormat)
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

export const getWeekDayLong = (dateToFormat: Date | string) => {
  const date = safeDate(dateToFormat)
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

/**
 *
 * Calculate WeeKs Number Based on
 *
 * @param showDate
 * @param firstShowDate
 */
export const weeks = (showDate: string, firstShowDate: string) => {
  const date = moment(showDate, 'YYYY-MM-DD')
  const TourStartDate = moment(firstShowDate, 'YYYY-MM-DD')
  const diff = moment.duration(TourStartDate.diff(date))

  let week = Math.floor(diff.asWeeks())
  if (week >= 0) {
    week = week + 1
  }

  return week
}

export const timeNow = () => {
  const today = new Date()
  return today.getHours().toFixed() + ':' + today.getMinutes().toFixed() + ':' + today.getSeconds().toFixed()
}

export const formatTime = (timestamp) => {
  // This will ignre date
  const today = new Date(timestamp)
  const options = { hours: '2-digit', minutes: '2-digit', seconds: '2-digit' }
  return today.toLocaleTimeString()
}

export const formatDateUK = (date) =>{
  // This will ignre date
  const today = new Date(date)
  return today.toLocaleDateString('en-GB')
}

export const getMonday = (inputDate) => {
  const currentDateObj = new Date(inputDate)
  currentDateObj.setDate(currentDateObj.getDate() - (currentDateObj.getDay() + 6) % 7)
  return currentDateObj
}

export const getSunday = (inputDate) => {
  const currentDateObj = new Date(inputDate)
  currentDateObj.setDate(currentDateObj.getDate() - (currentDateObj.getDay() + 7) % 7 + 1)
  return currentDateObj
}

export const quickISO = (DateString: string) =>{
  return new Date(DateString)
}

export const formDate = (DateString: string) => {
  const formDateString = DateString.toString()
  return formDateString.substring(0, 10)
}

export const dateService = {
  dateToSimple,
  dateToPicker,
  toISO,
  toSql,
  getWeekDay,
  weeks,
  dateTimeToTime,
  timeNow,
  formatTime,
  getMonday,
  getWeekDayLong,
  getSunday,
  formatDateUK,
  getDateDaysAgo,
  getDateDaysInFuture,
  quickISO,
  formDate,
  todayToSimple
}
