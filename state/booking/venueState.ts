import { VenueMinimalDTO } from 'interfaces'
import { atom } from 'recoil'

const intialState: Record<number, VenueMinimalDTO> = {}

export const venueState = atom({
  key: 'venueState',
  default: intialState
})
