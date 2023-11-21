import { atom } from 'recoil';

export interface BookingJump {
  selected?: number | string;
  bookings?: any[];
}

const intialState: BookingJump = {
  bookings: [],
};

export const bookingJumpState = atom({
  key: 'bookingJumpState',
  default: intialState,
});
