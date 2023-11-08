import { BookingDTO } from 'interfaces';
import { sort } from 'radash';
import { selector } from 'recoil';
import { bookingState } from 'state/booking/bookingState';

export const sortedBookingSelector = selector({
  key: 'sortedBookingSelector',
  get: ({ get }) => {
    const source = get(bookingState);
    const bookingArray = Object.values(source);
    return sort(bookingArray, (b: BookingDTO) => Date.parse(b.Date));
  },
});
