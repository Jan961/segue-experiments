import { VenueMinimalDTO } from 'interfaces'
import { selector } from 'recoil'
import { venueState } from '../venueState'

export const venueDictSelector = selector({
  key: 'venueDictSelector',
  get: ({ get }) => {
    const source = get(venueState)

    // Create lookup table
    const dictionary: Record<number, VenueMinimalDTO> = source.reduce((dictionary, x) => {
      dictionary[x.Id] = x
      return dictionary
    }, {})

    return dictionary
  }
})
