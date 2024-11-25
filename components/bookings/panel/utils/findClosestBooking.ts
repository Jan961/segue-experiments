import { BookingDTO } from 'interfaces';
import { newDate } from 'services/dateService';

export const findClosestBooking = (bookings: Record<number, BookingDTO>, specifiedDate: string) => {
  let closestDate = '1970-01-01'; // Allow initial comparisons
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

export const findPreviosAndNextBookings = (bookings: any, startDate: string, endDate: string): any => {
  let previousBooking = null;
  let nextBooking = null;
  let minDiffBefore = Infinity;
  let minDiffAfter = Infinity;

  const start = newDate(startDate).getTime();
  const end = newDate(endDate).getTime();

  for (const booking of bookings) {
    if (!booking.venueId) continue;
    const bookingDate = newDate(booking.dateTime).getTime();
    if (bookingDate < start && bookingDate !== start) {
      const diff = start - bookingDate;
      if (diff < minDiffBefore) {
        minDiffBefore = diff;
        previousBooking = booking;
      }
    } else if (bookingDate > end && bookingDate !== end) {
      const diff = bookingDate - end;
      if (diff < minDiffAfter) {
        minDiffAfter = diff;
        nextBooking = booking;
      }
    }
  }
  return { previousBooking, nextBooking };
};

export const hasContinuosGap = (bookingDict: Record<string, BookingDTO>, startDate: string, endDate: string) => {
  let hasGap = true;
  const start = newDate(startDate);
  const end = newDate(endDate);
  for (const bookingId in bookingDict) {
    const booking = bookingDict[bookingId];
    const bookingDate = newDate(booking.Date);
    if (bookingDate >= start && bookingDate <= end && booking.Id) {
      console.log(`Booking ${booking?.Id} ${booking?.Date} is already in the booking`);
      hasGap = false;
      break;
    }
  }
  return hasGap;
};
