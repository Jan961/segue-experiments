import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import {
  createMultipleBookings,
  deleteBookingById,
  deleteGetInFitUpById,
  deleteOtherById,
  deleteRehearsalById,
  updateBooking,
  updateGetInFitUp,
  updateOther,
  updateRehearsal,
} from 'services/bookingService';
import { BookingService } from './services/add.bookings';
import set from 'date-fns/set';
import { Booking, GetInFitUp, Other, Rehearsal } from '@prisma/client';
import { checkAccess, getEmailFromReq } from 'services/userService';
import { BookingItem } from 'components/bookings/modal/NewBooking/reducer';
import { parseISO } from 'date-fns';
import { isNullOrEmpty } from 'utils';
import { nanoid } from 'nanoid';
import { mapToPrismaFields } from './utils';

const formatBooking = (booking) => ({
  Id: booking.id,
  FirstDate: parseISO(booking.dateAsISOString),
  StatusCode: booking.bookingStatus,
  VenueId: booking.venue,
  PencilNum: Number(booking.pencilNo),
  Notes: booking.notes || '',
});

const formatNonPerformanceType = (booking) => ({
  Id: booking.id,
  StatusCode: booking.bookingStatus,
  VenueId: booking.venue,
  PencilNum: Number(booking.pencilNo),
  Notes: booking.notes || '',
});

const formatOtherType = (booking) => ({
  Id: booking.id,
  StatusCode: booking.bookingStatus,
  DateTypeId: booking.dayType,
  PencilNum: Number(booking.pencilNo),
  Notes: booking.notes || '',
});

const updateBookings = async (values) => {
  try {
    const bookingsToUpdate = values.filter(({ id }) => !Number.isNaN(id));

    let bookingsToCreate = values.filter(({ id }) => Number.isNaN(id));
    let result = null;
    const formattedBookings = formatBookings(bookingsToUpdate);
    await Promise.all(
      formattedBookings.map(async (booking, index) => {
        const timesToUpdate = bookingsToUpdate[index].times;
        let performanceTimes = null;
        if (timesToUpdate) {
          const splitTimes = timesToUpdate.split(';');
          performanceTimes = splitTimes.map((pt) => {
            const [hours, minutes] = pt.split(':');
            return set(booking.FirstDate, { hours: Number(hours), minutes: Number(minutes) });
          });
        }
        await updateBooking(booking as Booking, performanceTimes);
      }),
    );
    if (!isNullOrEmpty(bookingsToCreate)) {
      const runTagForRunOfDates = nanoid(8);
      bookingsToCreate = bookingsToUpdate.map((b) => ({
        ...b,
        runTag: runTagForRunOfDates,
      }));
      const created = await BookingService.createBookings(bookingsToCreate);
      result = { ...result, created };
      return result;
    }
  } catch (e) {
    console.log('Failed to update booking', e);
  }
};

const formatToPrisma = (booking: BookingItem) => {
  if (booking.isBooking) {
    return formatBooking(booking);
  } else if (booking.isRehearsal || booking.isGetInFitUp) {
    return formatNonPerformanceType(booking);
  }
  return formatOtherType(booking);
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
    console.log(original, updated);

    const rowsMap = {
      booking: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
      rehearsal: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
      getInFitUp: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
      other: { rowsToInsert: [], rowsToUpdate: [], rowsToDelete: [] },
    };
    // Check if this is a straight forward update or a delete-insert
    const acc = updated.reduce((acc, booking: BookingItem) => {
      const originalBooking = original.find(({ id }) => id === booking.id) as BookingItem;
      const originalType = getBookngType(originalBooking);
      const updatedType = getBookngType(booking);
      const formatted = formatToPrisma(booking);
      if (!formatted.Id) {
        acc[updatedType].rowsToInsert.push(formatted);
      } else {
        const canUpdate =
          originalBooking.isBooking === booking.isBooking &&
          originalBooking.isRehearsal === booking.isRehearsal &&
          originalBooking.isGetInFitUp === booking.isGetInFitUp;
        if (canUpdate) {
          acc[updatedType].rowsToUpdate.push(formatted);
        } else {
          acc[originalType].rowsToDelete.push(originalBooking);
          acc[updatedType].rowsToInsert.push(formatted);
        }
      }
      return acc;
    }, rowsMap);

    console.log('Reduced', acc);
    const promises = [];
    await prisma.$transaction(async (tx) => {
      for (const bookingType of Object.entries(acc)) {
        const [model, { rowsToInsert, rowsToUpdate, rowsToDelete }] = bookingType;
        rowsToDelete.forEach((rowToDelete) => {
          switch (model) {
            case 'booking':
              promises.push(deleteBookingById(rowToDelete));
              break;
            case 'rehearsal':
              promises.push(deleteBookingById(rowToDelete));
              break;
            case 'getInFitUp':
              promises.push(deleteBookingById(rowToDelete));
              break;
            default:
              promises.push(deleteBookingById(rowToDelete));
          }
        });
      }
    });
    /*  if (canUpdate) {
        if (updatedBooking.isBooking) {
          updateBookings(updated);
        } else if (updatedBooking.isGetInFitUp) {
          const formattedBookings = formatNonPerformanceType(updated);
          await Promise.all(
            formattedBookings.map(async (booking) => {
              await updateGetInFitUp(booking as GetInFitUp);
            }),
          );
        } else if (updatedBooking.isRehearsal) {
          const formattedBookings = formatNonPerformanceType(updated);
          await Promise.all(
            formattedBookings.map(async (booking) => {
              await updateRehearsal(booking as Rehearsal);
            }),
          );
        } else {
          const formattedBookings = formatOtherType(updated);
          await Promise.all(
            formattedBookings.map(async (booking) => {
              await updateOther(booking as Other);
            }),
          );
        }
      } else {
        // delete original and insert updated in a prisma transaction
        await Promise.all(
          original.map(async (booking) => {
            if (booking.isRehearsal) {
              await deleteRehearsalById(booking.id);
            } else if (booking.isBooking) {
              await deleteBookingById(booking.id);
            } else if (booking.isGetInFitUp) {
              await deleteGetInFitUpById(booking.id);
            } else {
              await deleteOtherById(booking.id);
            }
          }),
        );
        await createMultipleBookings(mapToPrismaFields(updated));
      } */

    res.status(200).json('Success');
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
}
