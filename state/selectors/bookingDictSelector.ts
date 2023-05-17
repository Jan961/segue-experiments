import { selector } from 'recoil'
import { BookingsByTourIdType } from 'services/bookingService'
import { bookingState } from 'state/bookingState'

export const bookingDictSelector = selector({
  key: 'bookingDictSelector',
  get: ({ get }) => {
    const source = get(bookingState)

    // Create lookup table
    const dictionary: Record<number, BookingsByTourIdType> = source.reduce((dictionary, booking) => {
      dictionary[booking.BookingId] = booking
      return dictionary
    }, {})

    return dictionary
  },
  set: ({ get, set }, newValue: BookingsByTourIdType) => {
    const source = get(bookingState)

    let found = false

    // Update existing
    const replacement = source.map(x => {
      if (x.BookingId === newValue.BookingId) {
        found = true
        return newValue
      }
      return x
    })

    // Handle adding
    if (!found) replacement.push(newValue)

    set(bookingState, replacement)
  }
})
