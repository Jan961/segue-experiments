import { atom } from 'recoil'
import { DateDistancesDTO } from 'services/venueService'

export type DistanceState = {
  stops: DateDistancesDTO[],
  outdated: boolean
  tourCode?: string
}

const intialState: DistanceState = {
  stops: [],
  outdated: true,
  tourCode: undefined
}

export const distanceState = atom({
  key: 'distanceState',
  default: intialState
})
