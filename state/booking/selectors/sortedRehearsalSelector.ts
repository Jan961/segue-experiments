import { sort } from 'radash'
import { selector } from 'recoil'
import { rehearsalState } from '../rehearsalState'
import { RehearsalDTO } from 'interfaces'

export const sortedRehearsalSelector = selector({
  key: 'sortedRehearsalSelector',
  get: ({ get }) => {
    const source = get(rehearsalState)
    const asArray = Object.values(source)
    return sort(asArray, (r: RehearsalDTO) => Date.parse(r.Date))
  }
})
