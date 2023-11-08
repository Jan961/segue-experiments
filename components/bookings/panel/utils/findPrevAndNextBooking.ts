import { BookingDTO } from 'interfaces';

// Optimisation possible. We can search outwards, rather than going over the whole lot
export const findPrevAndNextBookings = (bookings: Record<number, BookingDTO>, specifiedDate: string) => {
  let prevDate = '1970-01-01'; // Allow initial comparisons
  let prevBookings: number[] = [];

  let nextDate = '9999-12-31'; // Allow initial comparisons
  let nextBookings: number[] = [];

  const keys = Object.keys(bookings);

  // Go through each booking in the associative array
  for (const key of keys) {
    const bDate = bookings[key].Date.split('T')[0];
    const id = bookings[key].Id;

    if (bDate < specifiedDate) {
      // Get the more recent event that is before the date
      if (bDate > prevDate) {
        prevDate = bDate;
        prevBookings = [id];
      } else if (bDate === prevDate) {
        prevBookings.push(id);
      }
    }

    if (bDate > specifiedDate) {
      // Get the earliest event that is after the date
      if (bDate < nextDate) {
        nextDate = bDate;
        nextBookings = [id];
      } else if (bDate === nextDate) {
        nextBookings.push(id);
      }
    }
  }
  return { nextBookings, prevBookings };
};
