import { NextApiRequest, NextApiResponse } from 'next';
import {
  createGetInFitUp,
  createNewBooking,
  createNewRehearsal,
  createOtherBooking,
  deleteBookingById,
  deleteGetInFitUpById,
  deleteOtherById,
  deleteRehearsalById,
  updateBooking,
  updateGetInFitUp,
  updateOther,
  updateRehearsal,
} from 'services/bookingService';

import { checkAccess, getEmailFromReq } from 'services/userService';
import { BookingItem } from 'components/bookings/modal/NewBooking/reducer';
import {
  mapExistingBookingToPrismaFields,
  mapNewBookingToPrismaFields,
  mapNewOtherTypeToPrismaFields,
  mapNewRehearsalOrGIFUToPrismaFields,
} from './utils';

const formatNonPerformanceType = (booking) => ({
  Id: booking.id,
  StatusCode: booking.bookingStatus,
  VenueId: booking.venue,
  PencilNum: Number(booking.pencilNo),
  Notes: booking.notes || '',
  DateBlockId: booking.dateBlockId,
  Date: booking.dateAsISOString,
});

const formatOtherType = (booking) => ({
  Id: booking.id,
  StatusCode: booking.bookingStatus,
  DateTypeId: booking.dayType,
  PencilNum: Number(booking.pencilNo),
  Notes: booking.notes || '',
  DateBlockId: booking.dateBlockId,
  Date: booking.dateAsISOString,
});

const formatExistingBookingToPrisma = (booking: BookingItem) => {
  if (booking.isBooking) {
    return mapExistingBookingToPrismaFields(booking);
  } else if (booking.isRehearsal || booking.isGetInFitUp) {
    return formatNonPerformanceType(booking);
  }
  return formatOtherType(booking);
};

const formatNewBookingToPrisma = (booking: BookingItem) => {
  if (booking.isBooking) {
    return mapNewBookingToPrismaFields([booking])[0];
  } else if (booking.isRehearsal || booking.isGetInFitUp) {
    return mapNewRehearsalOrGIFUToPrismaFields(booking);
  }
  return mapNewOtherTypeToPrismaFields(booking);
};

const getBookngType = (booking: BookingItem) => {
  if (booking.isBooking) {
    return 'booking';
  } else if (booking.isRehearsal) {
    return 'rehearsal';
  } else if (booking.isGetInFitUp) {
    return 'getInFitUp';
  }
  return 'other';
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();
    const { original, updated } = req.body;

    const rowsMap = {
      booking: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
      rehearsal: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
      getInFitUp: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
      other: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
    };
    // Check if this is a straight forward update or a delete-insert
    const acc: typeof rowsMap = updated.reduce((acc, booking: BookingItem) => {
      const originalBooking = original.find(({ id }) => id === booking.id) as BookingItem;
      const originalType = getBookngType(originalBooking);
      const updatedType = getBookngType(booking);

      if (!booking.id) {
        acc[updatedType].rowsToInsert.push(formatNewBookingToPrisma(booking));
      } else {
        const canUpdate =
          originalBooking.isBooking === booking.isBooking &&
          originalBooking.isRehearsal === booking.isRehearsal &&
          originalBooking.isGetInFitUp === booking.isGetInFitUp;
        if (canUpdate) {
          acc[updatedType].rowsToUpdate.push(formatExistingBookingToPrisma(booking));
        } else {
          acc[originalType].rowsToDelete.push(originalBooking);
          acc[updatedType].rowsToInsert.push(formatNewBookingToPrisma(booking));
        }
      }
      return acc;
    }, rowsMap);

    const promises = [];

    for (const bookingType of Object.entries(acc)) {
      const [model, { rowsToInsert, rowsToUpdate, rowsToDelete }] = bookingType;

      rowsToUpdate.forEach((rowToUpdate) => {
        switch (model) {
          case 'booking': {
            promises.push(updateBooking(rowToUpdate));
            break;
          }
          case 'rehearsal':
            promises.push(updateRehearsal(rowToUpdate));
            break;
          case 'getInFitUp':
            promises.push(updateGetInFitUp(rowToUpdate));
            break;
          default:
            promises.push(updateOther(rowToUpdate));
        }
      });
      rowsToInsert.forEach((rowToInsert) => {
        switch (model) {
          case 'booking':
            promises.push(createNewBooking(rowToInsert));
            break;
          case 'rehearsal':
            promises.push(createNewRehearsal(rowToInsert));
            break;
          case 'getInFitUp':
            promises.push(createGetInFitUp(rowToInsert));
            break;
          default:
            promises.push(createOtherBooking(rowToInsert));
        }
      });
      rowsToDelete.forEach((rowToDelete) => {
        switch (model) {
          case 'booking':
            promises.push(deleteBookingById(rowToDelete.id));
            break;
          case 'rehearsal':
            promises.push(deleteRehearsalById(rowToDelete.id));
            break;
          case 'getInFitUp':
            promises.push(deleteGetInFitUpById(rowToDelete.id));
            break;
          default:
            promises.push(deleteOtherById(rowToDelete.id));
        }
      });
    }

    await Promise.allSettled(promises);

    res.status(200).json('Success');
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
}
