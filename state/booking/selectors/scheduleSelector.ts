import { selector } from 'recoil'
import { bookingState } from 'state/booking/bookingState'
import { dateBlockState } from 'state/booking/dateBlockState'
import { getInFitUpState } from 'state/booking/getInFitUpState'
import { rehearsalState } from 'state/booking/rehearsalState'
import { performanceState } from '../performanceState'

const getKey = (date: string) => (date.split('T')[0])

const getArrayOfDatesBetween = (start: string, end: string) => {
  const arr = []

  for (const dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getUTCDate() + 1)) {
    arr.push(new Date(dt).toISOString())
  }
  return arr.map(getKey)
}

export interface PerformanceViewModel {
  BookingId: number
  Id: number
  Date: string
}

export interface DateViewModel {
  Date: string
  RehearsalIds: number[]
  GetInFitUpIds: number[]
  PerformanceIds: number[]
  BookingIds: number[]
}

export interface ScheduleSectionViewModel {
  Dates: DateViewModel[]
  Name: string
}

export interface ScheduleViewModel {
  Sections: ScheduleSectionViewModel[]
}

export const scheduleSelector = selector({
  key: 'scheduleSelector',
  get: ({ get }) => {
    const rehearsals = get(rehearsalState)
    const bookings = get(bookingState)
    const getInFitUp = get(getInFitUpState)
    const performances = get(performanceState)
    // This one is an array (won't change on booking page)
    const dateBlocks = get(dateBlockState)

    const getDefaultDate = (key: string): DateViewModel => ({
      Date: key,
      BookingIds: [],
      RehearsalIds: [],
      GetInFitUpIds: [],
      PerformanceIds: []
    })

    const dates: Record<string, any> = {}

    const addDate = (date: string, property: string, data: number | PerformanceViewModel) => {
      const key = getKey(date)
      if (!dates[key]) dates[key] = getDefaultDate(key)
      dates[key][property].push(data)
    }

    Object.values(rehearsals).forEach(r => addDate(r.Date, 'RehearsalIds', r.Id))
    Object.values(getInFitUp).forEach(g => addDate(g.Date, 'GetInFitUpIds', g.Id))
    Object.values(bookings).forEach(b => addDate(b.Date, 'BookingIds', b.Id))
    Object.values(performances).forEach(p => {
      addDate(p.Date, 'PerformanceIds', p.Id)
      addDate(p.Date, 'BookingIds', p.BookingId)
    })

    return {
      Sections: dateBlocks.map((db) => ({
        Name: db.Name,
        Dates: getArrayOfDatesBetween(db.StartDate, db.EndDate)
          .map((date: string) => dates[date] ? dates[date] : getDefaultDate(date))
      }))
    }
  }
})
