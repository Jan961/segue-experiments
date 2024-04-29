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
import { isNullOrEmpty } from 'utils';
import { AddBookingsParams } from './interface/add.interface';

const formatNonPerformanceType = (booking) => ({
  Id: booking.id,
  StatusCode: booking.bookingStatus,
  VenueId: booking.venue,
  PencilNum: Number(booking.pencilNo),
  Notes: booking.notes || '',
  RunTag: booking.runTag,
});

const formatOtherType = (booking) => ({
  Id: booking.id,
  StatusCode: booking.bookingStatus,
  DateTypeId: booking.dayType,
  PencilNum: Number(booking.pencilNo),
  Notes: booking.notes || '',
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

    original.forEach((b) => {
      const originalChangedBooking = updated.find((u) => u.id === b.id);
      // Mark a booking for deletion if it is of type performance(iBooking) or if the booking is being deleted after change of length
      // or the booking daytype has chnaged which requires delete-insert into separate tables
      if (
        b.isBooking ||
        !originalChangedBooking ||
        b.isBooking !== originalChangedBooking.isBooking ||
        b.isRehearsal !== originalChangedBooking.isRehearsal ||
        b.isGetInFitUp !== originalChangedBooking.isGetInFitUp
      ) {
        rowsMap[getBookngType(b)].rowsToDelete.push(b);
      }
    });

    updated.forEach((u) => {
      if (!u.isBooking) {
        const canUpdate = !!original.find(
          (b) =>
            u.id === b.id &&
            b.isBooking === u.isBooking &&
            b.isRehearsal === u.isRehearsal &&
            b.isGetInFitUp === u.isGetInFitUp,
        );
        const bookingType = getBookngType(u);
        const formatted = canUpdate ? formatExistingBookingToPrisma(u) : formatNewBookingToPrisma(u);
        canUpdate
          ? rowsMap[bookingType].rowsToUpdate.push(formatted)
          : rowsMap[bookingType].rowsToInsert.push(formatted);
      }
    });

    // for a run of dates, we can have only one booking but multiple performances
    // so we can use the first performance/isBooking row from updated for that
    const performances = updated.filter(({ isBooking }) => isBooking);
    if (!isNullOrEmpty(performances)) {
      const formattedPerformances = mapNewBookingToPrismaFields(performances);
      const bookingToInsert = formattedPerformances.reduce((acc, item, index) => {
        if (index === 0) {
          acc = item;
        } else {
          acc.Performances = [...acc.Performances, ...item.Performances];
        }
        return acc;
      }, {} as Partial<AddBookingsParams>);
      rowsMap.booking.rowsToInsert.push(bookingToInsert);
    }

    const promises = [];

    for (const bookingType of Object.entries(rowsMap)) {
      const [type, { rowsToInsert, rowsToUpdate, rowsToDelete }] = bookingType;

      rowsToUpdate.forEach((rowToUpdate) => {
        switch (type) {
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
        switch (type) {
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
        switch (type) {
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
