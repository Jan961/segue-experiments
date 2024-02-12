import { atom } from 'recoil';

interface NewBoooking {
  stepIndex?: number;
}

const intialState: NewBoooking = {
  stepIndex: 0,
};

export const newBookingState = atom({
  key: 'newBookingState',
  default: intialState,
});
