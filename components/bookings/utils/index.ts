import { sub, format, add, parseISO } from 'date-fns';
import { BookingRow } from 'types/BookingTypes';
import { isNullOrEmpty } from 'utils';

export const DAY_TYPE_FILTERS = ['Performance', 'Rehearsal', 'Tech / Dress', 'Get in / Fit Up', 'Get Out'];
export const RUN_OF_DATES_DAY_TYPE_FILTERS = [...DAY_TYPE_FILTERS, 'Day Off'];

const getConsecutiveBooking = (bookings, date, order: 'before' | 'after') => {
  const nextDay = order === 'before' ? sub(date, { days: 1 }) : add(date, { days: 1 });
  const formattedNextDay = format(nextDay, 'EEE dd/MM/yy');

  const prev = bookings.findLast(({ date }) => formattedNextDay === date);
  return prev;
};

export const getAllConsecutiveBookings = (bookings, givenDate, order: 'before' | 'after') => {
  const result = [];
  let consecutiveDate = givenDate;

  while (consecutiveDate) {
    const nextBooking = getConsecutiveBooking(bookings, consecutiveDate, order);
    if (nextBooking) {
      order === 'before' ? result.unshift(nextBooking) : result.push(nextBooking);
    }
    consecutiveDate = nextBooking ? parseISO(nextBooking.dateTime) : null;
  }
  return result;
};

export const getRunOfDates = (bookings, booking): BookingRow[] => {
  if (isNullOrEmpty(bookings) || !booking) {
    return [];
  }
  const bookingDate = parseISO(booking.dateTime);
  const previousBookings = getAllConsecutiveBookings(bookings, bookingDate, 'before');
  const futureBookings = getAllConsecutiveBookings(bookings, bookingDate, 'after');
  return [...previousBookings, booking, ...futureBookings];
};

export const getVenueForDayType = (dayTypeOptions, dayType) => {
  const selectedDayTypeOption = dayTypeOptions.find(({ value }) => dayType === value);
  if (selectedDayTypeOption && !DAY_TYPE_FILTERS.includes(selectedDayTypeOption.text)) {
    return selectedDayTypeOption.text;
  }
  return '';
};

export const allowEditingForSelectedDayType = (dayTypeOptions, dayType) => {
  const selectedDayTypeOption = dayTypeOptions.find(({ value }) => dayType === value);
  return DAY_TYPE_FILTERS.includes(selectedDayTypeOption.text);
};
export const formatRowsForPencilledBookings = (values) => {
  const pencilled = values.filter(({ bookingStatus }) => bookingStatus === 'Pencilled');
  const groupedByDate = pencilled.reduce((acc, item) => {
    if (acc[item.date] !== undefined) {
      acc[item.date] = acc[item.date] + 1;
    } else {
      acc[item.date] = 1;
    }
    return acc;
  }, {});

  const multiple = Object.entries(groupedByDate)
    .filter(([_, v]: [string, number]) => v > 1)
    .map((arr) => arr[0]);

  const updated = values.map((r) => (multiple.includes(r.date) ? { ...r, multipleVenuesOnSameDate: true } : r));
  return updated;
};

export const formatRowsForMultipeBookingsAtSameVenue = (values) => {
  const groupedByVenue = values.reduce((acc, item) => {
    if (item.venue) {
      acc[item.venue] !== undefined ? (acc[item.venue] = acc[item.venue] + 1) : (acc[item.venue] = 1);
    }

    return acc;
  }, {});

  const venuesWithMultipleBookings = Object.entries(groupedByVenue)
    .filter(([_, v]: [string, number]) => v > 1)
    .map((arr) => arr[0]);

  const updated = values.map((r) =>
    venuesWithMultipleBookings.includes(r.venue) ? { ...r, venueHasMultipleBookings: true } : r,
  );
  return updated;
};
