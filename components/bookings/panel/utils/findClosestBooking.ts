import { BookingDTO } from 'interfaces';

export const findClosestBooking = (bookings: Record<number, BookingDTO>, specifiedDate: string) => {
  let closestDate: string = '1970-01-01'; // Allow initial comparisons
  let closestBookings: number[] = [];

  const keys = Object.keys(bookings);

  // Go through each booking in the associative array
  for (const key of keys) {
    const bDate = bookings[key].Date.split('T')[0];
    const id = bookings[key].Id;

    if (bDate <= specifiedDate) {
      // Get the more recent event that is before the date
      if (bDate > closestDate) {
        closestDate = bDate;
        closestBookings = [id];
      } else if (bDate === closestDate) {
        closestBookings.push(id);
      }
    }
  }
  return closestDate ? closestBookings : [];
};
