import { BookingItem } from 'components/bookings/modal/NewBooking/reducer';
import { AddBookingsParams } from './interface/add.interface';

export const mapNewBookingToPrismaFields = (values: BookingItem[] = []): AddBookingsParams[] => {
  const mapped: AddBookingsParams[] = values
    .filter((item) => item.dayType !== null && item.bookingStatus !== null)
    .map((item) => {
      const mappedItem = {
        DateBlockId: Number(item.dateBlockId),
        VenueId: item.venue,
        BookingDate: item.dateAsISOString,
        DateTypeId: item.dayType,
        Performances: item.times
          ? item.times
              .replace(/\s/g, '')
              .split(';')
              .map((time) => {
                const datePart = item.dateAsISOString.split('T')[0];
                return {
                  Time: `${datePart}T${time}:00Z`,
                  Date: item.dateAsISOString,
                };
              })
          : [
              {
                Time: null,
                Date: item.dateAsISOString,
              },
            ],
        StatusCode: item.bookingStatus,
        PencilNum: Number(item.pencilNo),
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

export const mapExistingBookingToPrismaFields = (value: BookingItem) => {
  if (value.dayType === null && value.bookingStatus === null) {
    throw new Error('Cannot update a booking with no day type and no status');
  }

  return {
    Id: value.id,
    VenueId: value.venue,
    Performances: value.times
      ? value.times
          .replace(/\s/g, '')
          .split(';')
          .map((time) => {
            const datePart = value.dateAsISOString.split('T')[0];
            return {
              Time: `${datePart}T${time}:00Z`,
              Date: value.dateAsISOString,
            };
          })
      : [
          {
            Time: null,
            Date: value.dateAsISOString,
          },
        ],
    StatusCode: value.bookingStatus,
    PencilNum: Number(value.pencilNo),
    Notes: value.notes,
    RunTag: value.runTag,
    DateBlockId: value.dateBlockId,
    FirstDate: value.dateAsISOString,
  };
};

export const mapNewRehearsalOrGIFUToPrismaFields = (booking) => ({
  DateBlockId: Number(booking.dateBlockId),
  StatusCode: booking.bookingStatus,
  VenueId: booking.venue,
  BookingDate: booking.dateAsISOString,
  PencilNum: Number(booking.pencilNo),
  Notes: booking.notes || '',
  RunTag: booking.runTag,
  isBooking: false,
  isRehearsal: booking.isRehearsal,
  isGetInFitUp: booking.isGetInFitUp,
});

export const mapNewOtherTypeToPrismaFields = (booking) => ({
  DateBlockId: Number(booking.dateBlockId),
  BookingDate: booking.dateAsISOString,
  StatusCode: booking.bookingStatus,
  DateTypeId: booking.dayType,
  PencilNum: Number(booking.pencilNo),
  Notes: booking.notes || '',
  RunTag: booking.runTag,
  isBooking: false,
  isRehearsal: false,
  isGetInFitUp: false,
});

export const getBookingType = (booking: BookingItem) => {
  if (booking.isBooking) {
    return 'booking';
  } else if (booking.isRehearsal) {
    return 'rehearsal';
  } else if (booking.isGetInFitUp) {
    return 'getInFitUp';
  }
  return 'other';
};
