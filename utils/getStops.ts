import { group } from 'radash';
import { getKey } from 'services/dateService';
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
        let lastPerformanceDate = new Date(BookingDate);
        PerformanceIds.forEach((performanceId: number) => {
          const performanceDate = getKey(performanceDict[performanceId]?.Date);
          if (performanceDate && new Date(performanceDate) > lastPerformanceDate) {
            lastPerformanceDate = new Date(performanceDate);
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
    const sortedStops = stops.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
    map[productionId] = sortedStops;
    return map;
  }, {});
};
