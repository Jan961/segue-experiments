import { BookingDTO } from 'interfaces'
import { selector } from 'recoil'
import { bookingState } from 'state/booking/bookingState'

export const bookingDictSelector = selector({
  key: 'bookingDictSelector',
  get: ({ get }) => {
    const source = get(bookingState)

    // Create lookup table
    const dictionary: Record<number, BookingDTO> = source.reduce((dictionary, booking) => {
      dictionary[booking.Id] = booking
      return dictionary
    }, {})

    return dictionary
  },
  set: ({ get, set }, newValue: BookingDTO) => {
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
    const sortedReplacement = replacement.sort((a, b) => new Date(a.Date) < new Date(b.Datee) ? -1 : 1)

    set(bookingState, sortedReplacement)
  }
})
