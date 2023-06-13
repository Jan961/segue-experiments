import { atom } from 'recoil'
import { DateDistancesDTO } from 'services/venueService'

export type DistanceState = DateDistancesDTO[]

const intialState: DistanceState = []

export const distanceState = atom({
  key: 'distanceState',
  default: intialState
})
