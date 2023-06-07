import { selector } from 'recoil'
import { sort } from 'radash'
import { dateBlockState } from '../dateBlockState'
import { bookingState } from '../bookingState'
import { differenceInWeeks, startOfWeek, isBefore, addWeeks, parseISO } from 'date-fns'
import { sortedBookingSelector } from './sortedBookingSelector'

const calculateWeekNumber = (tourStart: Date, dateToNumber: Date): number => {
  const weekOneStart = startOfWeek(tourStart, { weekStartsOn: 1 })
  let weekNumber = differenceInWeeks(dateToNumber, weekOneStart)

  // Handle the week boundary condition
  const adjustedStartDate = addWeeks(weekOneStart, weekNumber)
  if (isBefore(dateToNumber, adjustedStartDate)) weekNumber -= 1
  if (isBefore(dateToNumber, weekOneStart)) weekNumber -= 1

  weekNumber += 1

  return weekNumber
}

const getKey = (date: string) => (date.split('T')[0])

const getArrayOfDatesBetween = (start: string, end: string) => {
  const arr = []

  for (const dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getUTCDate() + 1)) {
    arr.push(new Date(dt).toISOString())
  }
  return arr.map(getKey)
}

export const weekNoSelector = selector({
  key: 'weekNoSelector',
  get: ({ get }) => {
    const dateBlocks = get(dateBlockState)
    const sorted = get(sortedBookingSelector)
    const tourStart = sorted[0]?.Date
    const start = sort(dateBlocks, d => Date.parse(d.StartDate))[0]?.StartDate
    const end = sort(dateBlocks, d => Date.parse(d.EndDate)).reverse()[0]?.EndDate

    if (!tourStart || !start || !end) return {}

    // Get all dates that need to be looked up
    const dates = getArrayOfDatesBetween(start, end)

    const result = {}

    const tourStartDate = parseISO(tourStart)

    for (const date of dates) result[date] = calculateWeekNumber(tourStartDate, parseISO(date))

    return result
  }
})
