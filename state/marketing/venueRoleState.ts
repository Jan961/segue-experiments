import { VenueRoleDTO } from 'interfaces'
import { atom } from 'recoil'

export type VenueRole = VenueRoleDTO[]

const intialState: VenueRole = []

export const venueRoleState = atom({
  key: 'venueRoleState',
  default: intialState
})
