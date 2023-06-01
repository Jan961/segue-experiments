import { RehearsalDTO } from 'interfaces'
import { selector } from 'recoil'
import { rehearsalState } from '../rehearsalState'

export const rehearsalDictSelector = selector({
  key: 'rehearsalDictSelector',
  get: ({ get }) => {
    const source = get(rehearsalState)

    // Create lookup table
    const dictionary: Record<number, RehearsalDTO> = source.reduce((dictionary, x) => {
      dictionary[x.Id] = x
      return dictionary
    }, {})

    return dictionary
  },
  set: ({ get, set }, newValue: RehearsalDTO) => {
    const source = get(rehearsalState)

    let found = false

    // Update existing
    const replacement = source.map(x => {
      if (x.Id === newValue.Id) {
        found = true
        return newValue
      }
      return x
    })

    // Handle adding
    if (!found) replacement.push(newValue)

    const sortedReplacement = replacement.sort((a, b) => new Date(a.Date) < new Date(b.Datee) ? -1 : 1)

    set(rehearsalState, sortedReplacement)
  }
})
