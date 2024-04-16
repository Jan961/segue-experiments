import { NextApiRequest, NextApiResponse } from 'next';
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

const formatBookings = (bookings) =>
  bookings.map((b) => ({
    Id: b.id,
    FirstDate: parseISO(b.dateAsISOString),
    StatusCode: b.bookingStatus,
    VenueId: b.venue,
    PencilNum: Number(b.pencilNo),
    Notes: b.notes || '',
  }));

const formatNonPerformanceType = (bookings) =>
  bookings.map((b) => ({
    Id: b.id,
    StatusCode: b.bookingStatus,
    VenueId: b.venue,
    PencilNum: Number(b.pencilNo),
    Notes: b.notes || '',
  }));

const formatOtherType = (bookings) =>
  bookings.map((b) => ({
    Id: b.id,
    StatusCode: b.bookingStatus,
    DateTypeId: b.dayType,
    PencilNum: Number(b.pencilNo),
    Notes: b.notes || '',
  }));

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

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    const { original, updated } = req.body;
    // Check if this is a straight forward update or a delete-insert
    const originalBooking = original[0] as BookingItem;
    const updatedBooking = updated.find(({ id }) => id === originalBooking.id) as BookingItem;
    if (updatedBooking) {
      const canUpdate =
        updatedBooking.isBooking === originalBooking.isBooking &&
        updatedBooking.isRehearsal === originalBooking.isRehearsal &&
        updatedBooking.isGetInFitUp === originalBooking.isGetInFitUp;

      if (canUpdate) {
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
        // delete original and insert updated in a prosma transaction
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
      }
    }
    res.status(200).json('Success');
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
}
