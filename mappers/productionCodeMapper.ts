import { getWeekDay, formatDateUK } from 'services/dateService';

export const mapBookingsToProductionOptions = (bookings) => {
  if (!bookings || bookings.length === 0) {
    return [];
  }
  const options = bookings
    .filter((b) => b.StatusCode !== 'U')
    .map((b) => {
      const date = new Date(b.Date);
      const weekday = getWeekDay(date);
      const ukDate = formatDateUK(date);
      return {
        text: `${b.Venue.Code} ${b.Venue.Name} ${weekday} ${ukDate} (${b.StatusCode})`,
        value: `${b.Id}`,
        date: ukDate,
      };
    });
  return options;
};
