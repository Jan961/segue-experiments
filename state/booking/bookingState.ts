import { BookingDTO } from 'interfaces'
import { atom } from 'recoil'

const intialState: BookingDTO[] = []

export const bookingState = atom({
  key: 'bookingState',
  default: intialState
})
