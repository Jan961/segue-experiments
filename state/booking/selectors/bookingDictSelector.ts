import { selector } from 'recoil'
import { BookingsByTourIdType } from 'services/bookingService'
import { bookingState } from 'state/booking/bookingState'

export const bookingDictSelector = selector({
  key: 'bookingDictSelector',
  get: ({ get }) => {
    const source = get(bookingState)

    // Create lookup table
    const dictionary: Record<number, BookingsByTourIdType> = source.reduce((dictionary, booking) => {
      dictionary[booking.Id] = booking
      return dictionary
    }, {})

    return dictionary
  },
  set: ({ get, set }, newValue: BookingsByTourIdType) => {
    const source = get(bookingState)

    let found = false

    // Update existing
    const replacement = source.map(x => {
      if (x.Id === newValue.Id) {
        found = true
        return newValue
      }
      return x
    })

    // Handle adding
    if (!found) replacement.push(newValue)
    const sortedReplacement = replacement.sort((a, b) => new Date(a.FirstDate) < new Date(b.FirstDate) ? -1 : 1)

    set(bookingState, sortedReplacement)
  }
})
