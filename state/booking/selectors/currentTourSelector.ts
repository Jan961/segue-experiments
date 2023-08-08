import { selector } from 'recoil'
import { tourJumpState } from '../tourJumpState'

export const currentTourSelector = selector({
  key: 'currentTourSelector',
  get: ({ get }) => {
    const { tours, selected } = get(tourJumpState)
    return tours.filter(x => x.Code === selected.toString())[0]
  }
})
