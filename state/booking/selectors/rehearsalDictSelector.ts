import { RehearsalDTO } from 'interfaces'
import { selector } from 'recoil'
import { rehearsalState } from '../rehearsalState'
import { objectify, replaceOrAppend, sort } from 'radash'

export const rehearsalDictSelector = selector({
  key: 'rehearsalDictSelector',
  get: ({ get }) => {
    const source = get(rehearsalState)
    return objectify(source, r => r.Id)
  },
  set: ({ get, set }, incoming: RehearsalDTO) => {
    const source = get(rehearsalState)

    const replacement = replaceOrAppend(source, incoming, r => r.Id === incoming.Id)
    const sortedReplacement = sort(replacement, r => Date.parse(r.Date))

    set(rehearsalState, sortedReplacement)
  }
})
