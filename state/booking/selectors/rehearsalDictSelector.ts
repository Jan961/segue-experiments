import { RehearsalDTO } from 'interfaces'
import { selector } from 'recoil'
import { rehearsalState } from '../rehearsalState'

export const rehearsalDictSelector = selector({
  key: 'rehearsalDictSelector',
  get: ({ get }) => {
    return get(rehearsalState)
  },
  set: ({ get, set }, incoming: RehearsalDTO) => {
    const source = get(rehearsalState)

    const replacement = { ...source, [incoming.Id]: incoming }

    set(rehearsalState, replacement)
  }
})
