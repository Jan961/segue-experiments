import { selector } from 'recoil'
import { DateViewModel, ScheduleSectionViewModel, scheduleSelector } from './scheduleSelector'
import { filterState } from '../filterState'
import { getInFitUpState } from '../getInFitUpState'
import { bookingState } from '../bookingState'
import { venueState } from '../venueState'

export const filteredScheduleSelector = selector({
  key: 'filteredScheduleSelector',
  get: ({ get }) => {
    const source = get(scheduleSelector)
    const { venueText } = get(filterState)
    if (!venueText) return source

    const lowerCaseVenueText = venueText.toLowerCase()

    const venueDict = get(venueState)
    const gifuDict = get(getInFitUpState)
    const bookingDict = get(bookingState)

    const isMatch = (date: DateViewModel) => {
      const bookingVenues = date.BookingIds.map((bId: number) => bookingDict[bId].VenueId)
      const gifuVenues = date.GetInFitUpIds.map((gifuId: number) => gifuDict[gifuId].VenueId)

      for (const vId of [...gifuVenues, ...bookingVenues]) {
        const venue = venueDict[vId]
        if (venue.Code.toLowerCase().startsWith(lowerCaseVenueText)) return true
        if (venue.Name.toLowerCase().includes(lowerCaseVenueText)) return true
      }
      return false
    }

    return {
      ...source,
      Sections: source.Sections.map((sec: ScheduleSectionViewModel) => ({
        ...sec,
        Dates: sec.Dates.filter(d => isMatch(d))
      })).filter(x => x.Dates.length > 0)
    }
  }
})
