import { Venue } from 'interfaces'
import { atom } from 'recoil'

const intialState: Venue[] = []

export const venueState = atom({
  key: 'venueState',
  default: intialState
})
