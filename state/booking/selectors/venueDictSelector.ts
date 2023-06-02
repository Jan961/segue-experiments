import { selector } from 'recoil'
import { venueState } from '../venueState'
import { objectify } from 'radash'

export const venueDictSelector = selector({
  key: 'venueDictSelector',
  get: ({ get }) => {
    const source = get(venueState)
    return objectify(source, v => v.Id)
  }
})
