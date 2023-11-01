import { BookingDTO } from 'interfaces';
import { atom } from 'recoil';

export type BookingState = Record<number, BookingDTO>;

export const bookingState = atom({
  key: 'bookingState',
  default: {} as BookingState,
});
