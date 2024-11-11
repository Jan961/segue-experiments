import { NextApiRequest, NextApiResponse } from 'next';
import {
  createGetInFitUp,
  createNewBooking,
  createNewRehearsal,
  createOtherBooking,
  deleteGetInFitUpById,
  deleteOtherById,
  deletePerformancesForBooking,
  deleteRehearsalById,
  updateBooking,
  updateGetInFitUp,
  updateOther,
  updateRehearsal,
} from 'services/bookingService';

import { BookingItem } from 'components/bookings/modal/NewBooking/reducer';
import {
  getBookingType,
  mapExistingBookingToPrismaFields,
  mapNewBookingToPrismaFields,
  mapNewOtherTypeToPrismaFields,
  mapNewRehearsalOrGIFUToPrismaFields,
} from './utils';
import getPrismaClient from 'lib/prisma';

const formatNonPerformanceType = (booking) => ({
  Id: booking.id,
  StatusCode: booking.bookingStatus,
  VenueId: booking.venue,
  PencilNum: Number(booking.pencilNo),
  Notes: booking.notes || '',
  DateBlockId: booking.dateBlockId,
  Date: booking.dateAsISOString,
  RunTag: booking.runTag,
});

const formatOtherType = (booking) => ({
  Id: booking.id,
  StatusCode: booking.bookingStatus,
  DateTypeId: booking.dayType,
  PencilNum: Number(booking.pencilNo),
  Notes: booking.notes || '',
  DateBlockId: booking.dateBlockId,
  Date: booking.dateAsISOString,
  RunTag: booking.runTag,
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

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { original, updated } = req.body;

    // This API only deals witha single type of bookingand hence the original array is expected to ahve a single ite (the Bookings table row being edited)
    if (original?.length !== 1) {
      throw new Error('Original array is expected to have a single item');
    }
    const originalItem = original[0];
    const prisma = await getPrismaClient(req);
    const rowsMap = {
      booking: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
      rehearsal: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
      getInFitUp: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
      other: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
    };
    // Check if this is a straight forward update or a delete-insert
    const acc: typeof rowsMap = updated.reduce((acc, booking: BookingItem) => {
      const shouldUpdateBooking = originalItem.isBooking && booking.isBooking;
      if (shouldUpdateBooking) {
        acc.booking.rowsToUpdate.push(formatExistingBookingToPrisma({ ...booking, id: originalItem.id }));
      } else {
        const editedItem = original.find(({ id }) => id === booking.id) as BookingItem;
        const originalType = editedItem ? getBookingType(editedItem) : null;
        const updatedType = getBookingType(booking);

        if (!booking.id) {
          acc[updatedType].rowsToInsert.push(formatNewBookingToPrisma(booking));
        } else {
          const canUpdate =
            editedItem.isBooking === booking.isBooking &&
            editedItem.isRehearsal === booking.isRehearsal &&
            editedItem.isGetInFitUp === booking.isGetInFitUp;
          if (canUpdate) {
            acc[updatedType].rowsToUpdate.push(formatExistingBookingToPrisma(booking));
          } else {
            acc[originalType].rowsToDelete.push(editedItem);
            acc[updatedType].rowsToInsert.push(formatNewBookingToPrisma(booking));
          }
        }
      }
      return acc;
    }, rowsMap);

    // check if the original item needs deleting
    if (!updated.find(({ id }) => id === originalItem.id)) {
      const type = getBookingType(originalItem);
      acc[type].rowsToDelete.push(originalItem);
    }

    const promises = [];
    for (const bookingType of Object.entries(acc)) {
      const [model, { rowsToInsert, rowsToUpdate, rowsToDelete }] = bookingType;

      rowsToUpdate.forEach((rowToUpdate) => {
        switch (model) {
          case 'booking': {
            promises.push(updateBooking(rowToUpdate, prisma));
            break;
          }
          case 'rehearsal':
            promises.push(updateRehearsal(rowToUpdate, prisma));
            break;
          case 'getInFitUp':
            promises.push(updateGetInFitUp(rowToUpdate, prisma));
            break;
          default:
            promises.push(updateOther(rowToUpdate, prisma));
        }
      });
      rowsToInsert.forEach((rowToInsert) => {
        switch (model) {
          case 'booking':
            promises.push(createNewBooking(rowToInsert, prisma));
            break;
          case 'rehearsal':
            promises.push(createNewRehearsal(rowToInsert, prisma));
            break;
          case 'getInFitUp':
            promises.push(createGetInFitUp(rowToInsert, prisma));
            break;
          default:
            promises.push(createOtherBooking(rowToInsert, prisma));
        }
      });
      rowsToDelete.forEach((rowToDelete) => {
        switch (model) {
          case 'booking':
            promises.push(deletePerformancesForBooking(rowToDelete.id, prisma));
            break;
          case 'rehearsal':
            promises.push(deleteRehearsalById(rowToDelete.id, prisma));
            break;
          case 'getInFitUp':
            promises.push(deleteGetInFitUpById(rowToDelete.id, prisma));
            break;
          default:
            promises.push(deleteOtherById(rowToDelete.id, prisma));
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
