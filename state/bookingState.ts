import { atom } from 'recoil'
import { BookingsByTourIdType } from 'services/bookingService'

const intialState: BookingsByTourIdType[] = []

export const bookingState = atom({
  key: 'bookingState',
  default: intialState
})
