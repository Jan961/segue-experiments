import { NextApiRequest, NextApiResponse } from 'next';
import {
  createGetInFitUp,
  createNewBooking,
  createNewRehearsal,
  createOtherBooking,
  deletePerformancesForBooking,
  deleteGetInFitUpById,
  deleteOtherById,
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
import { isNullOrEmpty } from 'utils';
import { AddBookingsParams } from './interface/add.interface';
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
    const prisma = await getPrismaClient(req);
    const rowsMap = {
      booking: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
      rehearsal: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
      getInFitUp: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
      other: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
    };

    // check if the original item needs deleting
    original.forEach((b) => {
      const originalChangedBooking = updated.find((u) => u.id === b.id);

      if (
        !originalChangedBooking ||
        b.isBooking !== originalChangedBooking.isBooking ||
        b.isRehearsal !== originalChangedBooking.isRehearsal ||
        b.isGetInFitUp !== originalChangedBooking.isGetInFitUp
      ) {
        rowsMap[getBookingType(b)].rowsToDelete.push(b);
      }
    });

    // Update or Insert for all non-performance types
    updated.forEach((u) => {
      if (!u.isBooking) {
        const canUpdate = !!original.find(
          (b) =>
            u.id === b.id &&
            b.isBooking === u.isBooking &&
            b.isRehearsal === u.isRehearsal &&
            b.isGetInFitUp === u.isGetInFitUp,
        );
        const bookingType = getBookingType(u);
        const formatted = canUpdate ? formatExistingBookingToPrisma(u) : formatNewBookingToPrisma(u);
        canUpdate
          ? rowsMap[bookingType].rowsToUpdate.push(formatted)
          : rowsMap[bookingType].rowsToInsert.push(formatted);
      }
    });

    // Check if have a performance row in the edited run-of-dates booking
    // if so, use the same booking id to insert performances
    // if not, create a new booking
    const editedPerformanceItem = original.find(({ isBooking }) => isBooking);
    const performances = updated.filter(({ isBooking }) => isBooking);

    if (!isNullOrEmpty(performances)) {
      const formattedPerformances = editedPerformanceItem
        ? performances.map((p) => mapExistingBookingToPrismaFields(p))
        : mapNewBookingToPrismaFields(performances);

      const bookingToInsert = formattedPerformances.reduce((acc, item, index) => {
        if (index === 0) {
          acc = item;
        } else {
          acc.Performances = [...acc.Performances, ...item.Performances];
        }
        // Sinc performances for an existing booking will be re-created, we need to delete the old ones
        rowsMap.booking.rowsToDelete.push(item);

        return acc;
      }, {} as Partial<AddBookingsParams>);

      editedPerformanceItem
        ? rowsMap.booking.rowsToUpdate.push(bookingToInsert)
        : rowsMap.booking.rowsToInsert.push(bookingToInsert);
    }

    const promises = [];

    for (const bookingType of Object.entries(rowsMap)) {
      const [type, { rowsToInsert, rowsToUpdate, rowsToDelete }] = bookingType;
      const deletePromises = [];
      rowsToDelete.forEach((rowToDelete) => {
        switch (type) {
          case 'booking':
            deletePromises.push(deletePerformancesForBooking(rowToDelete.id, prisma));
            break;
          case 'rehearsal':
            deletePromises.push(deleteRehearsalById(rowToDelete.id, prisma));
            break;
          case 'getInFitUp':
            deletePromises.push(deleteGetInFitUpById(rowToDelete.id, prisma));
            break;
          default:
            deletePromises.push(deleteOtherById(rowToDelete.id, prisma));
        }
      });
      await Promise.allSettled(deletePromises);

      rowsToUpdate.forEach((rowToUpdate) => {
        switch (type) {
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
        switch (type) {
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
    }

    await Promise.allSettled(promises);

    res.status(200).json('Success');
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
}
