import { atom } from 'recoil'
import { DateDistancesDTO } from 'services/venueService'

const intialState: DateDistancesDTO[] = []

export const distanceState = atom({
  key: 'distanceState',
  default: intialState
})
