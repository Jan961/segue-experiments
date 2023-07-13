import { atom } from 'recoil'

export interface BookingJump {
  selected?: number
  bookings?: any[]
}

const intialState: BookingJump = {
}

export const bookingJumpState = atom({
  key: 'bookingJumpState',
  default: intialState
})
