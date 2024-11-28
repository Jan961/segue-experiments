import { UTCDate } from '@date-fns/utc';
import { getWeekDay } from 'services/dateService';
import formatInputDate from 'utils/dateInputFormat';

export const mapBookingsToProductionOptions = (bookings) => {
  if (!bookings || bookings.length === 0) {
    return [];
  }
  const options = bookings
    .filter((b) => b.StatusCode !== 'U')
    .map((b) => {
      const date = new UTCDate(b.Date);
      const weekday = getWeekDay(date, 'short').toUpperCase();
      const ukDate = formatInputDate(date);
      return {
        text: `${b.Venue.Code} ${b.Venue.Name} | ${weekday} ${ukDate} (${b.StatusCode})`,
        value: `${b.Id}`,
        date: ukDate,
      };
    });
  return options;
};
