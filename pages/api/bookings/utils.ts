import { BookingItem } from 'components/bookings/modal/NewBooking/reducer';

export const mapToPrismaFields = (values: BookingItem[] = []) => {
  const mapped = values
    .filter((item) => item.dayType !== null && item.bookingStatus !== null)
    .map((item) => {
      const mappedItem = {
        DateBlockId: Number(item.dateBlockId),
        VenueId: item.venue,
        Date: item.dateAsISOString,
        DateTypeId: item.dayType,
        performanceTimes: item.times ? item.times.split(';') : [],
        BookingStatus: item.bookingStatus,
        PencilNo: Number(item.pencilNo),
        Notes: item.notes,
        isBooking: item.isBooking || item.perf,
        isRehearsal: item.isRehearsal,
        isGetInFitUp: item.isGetInFitUp,
        RunTag: item.runTag,
      };
      return mappedItem;
    });
  return mapped;
};
