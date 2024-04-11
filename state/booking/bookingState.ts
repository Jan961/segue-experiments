import { BookingDTO } from 'interfaces';
import { atom } from 'recoil';

export type BookingState = Record<number, BookingDTO>;

export type AddEditBookingState = {
  visible: boolean;
  startDate?: string;
  endDate?: string;
  booking?: any;
};

export const ADD_EDIT_MODAL_DEFAULT_STATE = {
  visible: false,
  startDate: null,
  endDate: null,
  booking: null,
};

export const bookingState = atom({
  key: 'bookingState',
  default: {} as BookingState,
});

export const addEditBookingState = atom({
  key: 'addEditBookingState',
  default: ADD_EDIT_MODAL_DEFAULT_STATE as AddEditBookingState,
});
