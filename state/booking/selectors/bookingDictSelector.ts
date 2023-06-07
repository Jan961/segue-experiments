import { BookingDTO } from 'interfaces'
import { selector } from 'recoil'
import { bookingState } from 'state/booking/bookingState'

export const bookingDictSelector = selector({
  key: 'bookingDictSelector',
  get: ({ get }) => {
    const source = get(bookingState)
    return source
  },
  set: ({ get, set }, incoming: BookingDTO) => {
    const source = get(bookingState)

    const replacement = {...source, [incoming.Id]: incoming }

    set(bookingState, replacement)
  }
})
