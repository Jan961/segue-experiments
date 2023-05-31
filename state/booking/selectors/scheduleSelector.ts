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

    const getDefaultDate = (Id: string) => ({
      Id,
      Booking: [],
      Rehearsal: [],
      GetInFitUp: [],
      Performance: []
    })

    const dates: Record<string, any> = {}

    // We need to flip these
    for (const r of rehearsals) {
      const key = getKey(r.Date)

      if (!dates[key]) dates[key] = getDefaultDate(key)
      dates[key].Rehearsal.push(r.Id)
    }

    for (const g of getInFitUp) {
      const key = getKey(g.Date)

      if (!dates[key]) dates[key] = getDefaultDate(key)
      dates[key].GetInFitUp.push(g.Id)
    }

    for (const b of bookings) {
      console.log(dates)
      const key = getKey(b.Date)

      if (!dates[key]) dates[key] = getDefaultDate(key)

      for (const p of b.Performances) {
        const pKey = getKey(p)
        if (!dates[pKey]) dates[pKey] = getDefaultDate(pKey)
        // Add a reference for all the perforances
        dates[pKey].Performance.push(b.Id)
      }

      dates[key].Booking.push(b.Id)
    }

    const result: ScheduleViewModel = {
      Sections: dateBlocks.map((db) => ({
        Name: db.Name,
        Dates: getArrayOfDatesBetween(db.StartDate, db.EndDate).map((date: string) => ({
          Date: date,
          RehearsalIds: dates[date] ? dates[date].Rehearsal : [],
          GetInFitUpIds: dates[date] ? dates[date].GetInFitUp : [],
          BookingIds: dates[date] ? dates[date].Booking : [],
          PerformanceIds: dates[date] ? dates[date].Performance : []
        }))
      }))
    }

    return result
  }
})
