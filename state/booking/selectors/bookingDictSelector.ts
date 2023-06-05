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

    console.log(incoming)

    console.log(source)
    const replacement = replaceOrAppend(source, incoming, b => b.Id === incoming.Id)
    console.log(replacement)
    const sortedReplacement = sort(replacement, b => Date.parse(b.Date))
    console.log(sortedReplacement)

    set(bookingState, sortedReplacement)
  }
})
