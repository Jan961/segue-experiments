import { selector } from 'recoil'
import { performanceState } from '../performanceState'

export const performanceDictSelector = selector({
  key: 'performanceDictSelector',
  get: ({ get }) => {
    return get(performanceState)
  }
})
