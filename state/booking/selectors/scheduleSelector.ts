import { selector } from 'recoil'
import { bookingState } from 'state/booking/bookingState'
import { dateBlockState } from 'state/booking/dateBlockState'
import { getInFitUpState } from 'state/booking/getInFitUpState'
import { rehearsalState } from 'state/booking/rehearsalState'

const getKey = (date: string) => {
  return date.split('T')[0]
}

const getArrayOfDatesBetween = (start: string, end: string) => {
  const arr = []

  for (const dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getUTCDate() + 1)) {
    arr.push(new Date(dt).toISOString())
  }
  return arr.map(getKey)
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
    const dateBlocks = get(dateBlockState)

    const getDefaultDate = (key: string) => ({
      Date: key,
      BookingIds: [],
      RehearsalIds: [],
      GetInFitUpIds: [],
      PerformanceIds: []
    })

    const dates: Record<string, any> = {}

    const addDate = (date: string, property: string, id: number) => {
      const key = getKey(date)
      if (!dates[key]) dates[key] = getDefaultDate(key)
      dates[key][property].push(id)
    }

    for (const r of rehearsals) addDate(r.Date, 'RehearsalIds', r.Id)
    for (const g of getInFitUp) addDate(g.Date, 'GetInFitUpIds', g.Id)
    for (const b of bookings) {
      // Add a reference for all the perforances so we can display Runs
      for (const p of b.Performances) addDate(p, 'PerformanceIds', b.Id)
      addDate(b.Date, 'BookingIds', b.Id)
    }

    return {
      Sections: dateBlocks.map((db) => ({
        Name: db.Name,
        Dates: getArrayOfDatesBetween(db.StartDate, db.EndDate)
          .map((date: string) => dates[date] ? dates[date] : getDefaultDate(date))
      }))
    }
  }
})
