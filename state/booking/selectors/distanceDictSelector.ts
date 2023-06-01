import { selector } from 'recoil'
import { DateDistancesDTO } from 'services/venueService'
import { distanceState } from '../distanceState'

export const distanceDictSelector = selector({
  key: 'distanceDictSelector',
  get: ({ get }) => {
    const source = get(distanceState)

    // Create lookup table
    const dictionary: Record<number, DateDistancesDTO> = source.reduce((dictionary, x) => {
      dictionary[x.Date] = x
      return dictionary
    }, {})

    return dictionary
  }
})
