import { BookingDTO } from 'interfaces'
import { objectify, replaceOrAppend, sort } from 'radash'
import { selector } from 'recoil'
import { bookingState } from 'state/booking/bookingState'

export const bookingDictSelector = selector({
  key: 'bookingDictSelector',
  get: ({ get }) => {
    const source = get(bookingState)
    return objectify(source, b => b.Id)
  },
  set: ({ get, set }, incoming: BookingDTO) => {
    const source = get(bookingState)

    const replacement = replaceOrAppend(source, incoming, b => b.Id === incoming.Id)
    const sortedReplacement = sort(replacement, b => Date.parse(b.Date))

    set(bookingState, sortedReplacement)
  }
})
