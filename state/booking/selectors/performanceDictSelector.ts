import { objectify } from 'radash'
import { selector } from 'recoil'
import { bookingState } from 'state/booking/bookingState'

export const performanceDictSelector = selector({
  key: 'performanceDictSelector',
  get: ({ get }) => {
    const source = get(bookingState)
    return objectify(source, b => b.Id)
  }
})
