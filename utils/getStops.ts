import { group } from 'radash';
import { getKey, newDate } from 'services/dateService';
import { DistanceStop } from 'services/venueService';
import { BookingState } from 'state/booking/bookingState';
import { type PerformanceState } from 'state/booking/performanceState';

export const getStops = (bookingDict: BookingState, performanceDict: PerformanceState) => {
  // Get distances
  const bookings = Object.values(bookingDict);
  const bookingsByProduction = group(bookings, (booking) => booking.ProductionId);

  return Object.keys(bookingsByProduction).reduce((map, productionId) => {
    const grouped = bookingsByProduction[productionId]?.reduce(
      (acc, { VenueId, Date: BookingDate, PerformanceIds, StatusCode }) => {
        let lastPerformanceDate = newDate(BookingDate);
        PerformanceIds.forEach((performanceId: number) => {
          const performanceDate = getKey(performanceDict[performanceId]?.Date);
          if (performanceDate && newDate(performanceDate) > lastPerformanceDate) {
            lastPerformanceDate = newDate(performanceDate);
          }
        });
        BookingDate = lastPerformanceDate?.toISOString();
        if (StatusCode !== 'X' && StatusCode !== 'S') {
          (acc[BookingDate] = acc[BookingDate] || []).push(VenueId);
        }
        return acc;
      },
      {},
    );
    const stops = Object.entries(grouped).map(([Date, Ids]): DistanceStop => ({ Date, Ids: Ids as number[] }));
    const sortedStops = stops.sort((a, b) => newDate(a.Date).getTime() - newDate(b.Date).getTime());
    map[productionId] = sortedStops;
    return map;
  }, {});
};
