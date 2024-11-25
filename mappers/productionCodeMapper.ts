import { UTCDate } from '@date-fns/utc';
import { dateToSimple, getWeekDay } from 'services/dateService';

export const mapBookingsToProductionOptions = (bookings) => {
  if (!bookings || bookings.length === 0) {
    return [];
  }
  const options = bookings
    .filter((b) => b.StatusCode !== 'U')
    .map((b) => {
      const date = new UTCDate(b.Date);
      const weekday = getWeekDay(date, 'short').toUpperCase();
      const ukDate = dateToSimple(date);
      return {
        text: `${b.Venue.Code} ${b.Venue.Name} | ${weekday} ${ukDate} (${b.StatusCode})`,
        value: `${b.Id}`,
        date: ukDate,
      };
    });
  return options;
};
