import { selector } from 'recoil'
import { sort } from 'radash'
import { dateBlockState } from '../dateBlockState'
import { parseISO } from 'date-fns'
import { sortedBookingSelector } from './sortedBookingSelector'
import { calculateWeekNumber } from 'services/dateService'
import { getArrayOfDatesBetween } from 'utils/getDatesBetween'

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
