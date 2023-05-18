import moment from 'moment'

const safeDate = (date: Date | string) => {
  if (typeof date === 'string') return new Date(date)
  return date
}

const dateToSimple = (dateToFormat: Date | string) => {
  if (!dateToFormat) return 'DD/MM/YYYY'
  const date = safeDate(dateToFormat)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', day: '2-digit', month: '2-digit', timeZone: 'UTC' }
  return date.toLocaleDateString('en-GB', options)
}

function dateTimeToTime (dateToFormat) {
  return moment(dateToFormat).format('HH:mm')
}

function toISO (date) {
  return date.toISOString()
}

function toSql (date) {
  return date.slice(0, 10)
}

function getDateDaysAgo (date, daysToSubtract) {
  date = new Date(date)
  return moment(date, 'dd/mm/yyyy').subtract(daysToSubtract, 'days')
}

function getDateDaysInFuture (date, daysToSubtract) {
  date = new Date(date)
  return moment(date, 'dd/mm/yyyy').add(daysToSubtract, 'days')
}

function getWeekDay (dateToFormat: Date | string) {
  const date = safeDate(dateToFormat)
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

function getWeekDayLong (dateToFormat: Date | string) {
  const date = safeDate(dateToFormat)
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

/**
 *
 * Calculate WeeKs Number Based on
 *
 * @param ShowDate
 * @param Date
 */
function weeks (ShowDate, Date) {
  const date = moment(ShowDate, 'YYYY-MM-DD')
  const TourStartDate = moment(Date, 'YYYY-MM-DD')
  const diff = moment.duration(TourStartDate.diff(date))

  let week = Math.floor(diff.asWeeks())
  if (week >= 0) {
    week = week + 1
  }

  return week
}

function timeNow () {
  const today = new Date()
  return today.getHours().toFixed() + ':' + today.getMinutes().toFixed() + ':' + today.getSeconds().toFixed()
}

function formatTime (timestamp) {
  // This will ignre date
  const today = new Date(timestamp)
  const options = { hours: '2-digit', minutes: '2-digit', seconds: '2-digit' }
  return today.toLocaleTimeString()
}

function formatDateUK (date) {
  // This will ignre date
  const today = new Date(date)
  return today.toLocaleDateString('en-GB')
}

/**
 * This is a get Week Start
 * @param inputDate
 */
function getMonday (inputDate) {
  const currentDateObj = new Date(inputDate)
  currentDateObj.setDate(currentDateObj.getDate() - (currentDateObj.getDay() + 6) % 7)
  return currentDateObj
}

/**
 * Get Week End
 * @param inputDate
 */
function getSunday (inputDate) {
  const currentDateObj = new Date(inputDate)
  currentDateObj.setDate(currentDateObj.getDate() - (currentDateObj.getDay() + 7) % 7 + 1)
  return currentDateObj
}

function quickISO (DateString) {
  const date = new Date(DateString)
  console.log(date)
  return date// .toISOString().substr(0, 10);
}

function formDate (DateString) {
  // const date = new Date(DateString);
  // return DateString.substring(0,10);

  // return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')

  const formDateString = DateString.toString()
  return formDateString.substring(0, 10)
}

export const dateService = {
  dateToSimple,
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
  formDate
}

