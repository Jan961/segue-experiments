import { objectify } from 'radash'
import { selector } from 'recoil'
import { performanceState } from '../performanceState'

export const performanceDictSelector = selector({
  key: 'performanceDictSelector',
  get: ({ get }) => {
    const source = get(performanceState)
    return objectify(source, b => b.Id)
  }
})
