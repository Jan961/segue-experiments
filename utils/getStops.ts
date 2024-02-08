import { group } from 'radash';
import { DistanceStop } from 'services/venueService';
import { BookingState } from 'state/booking/bookingState';

export const getStops = (bookingDict: BookingState) => {
  // Get distances
  const bookings = Object.values(bookingDict);
  const bookingsByProduction = group(bookings, (booking) => booking.ProductionId);
  return Object.keys(bookingsByProduction).reduce((map, productionId) => {
    const grouped = bookingsByProduction[productionId]?.reduce((acc, { VenueId, Date }) => {
      (acc[Date] = acc[Date] || []).push(VenueId);
      return acc;
    }, {});
    const stops = Object.entries(grouped).map(([Date, Ids]): DistanceStop => ({ Date, Ids: Ids as number[] }));
    const sortedStops = stops.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
    map[productionId] = sortedStops;
    return map;
  }, {});
};
