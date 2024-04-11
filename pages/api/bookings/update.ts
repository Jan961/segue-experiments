import { NextApiRequest, NextApiResponse } from 'next';
import { updateBooking, updateGetInFitUp } from 'services/bookingService';
import set from 'date-fns/set';
import { Booking, GetInFitUp } from '@prisma/client';
import { checkAccess, getEmailFromReq } from 'services/userService';
import { BookingItem } from 'components/bookings/modal/NewBooking/reducer';
import { parseISO } from 'date-fns';

const formatBookings = (bookings) =>
  bookings.map((b) => ({
    Id: b.id,
    FirstDate: parseISO(b.dateAsISOString),
    StatusCode: b.bookingStatus,
    VenueId: b.venue,
    PencilNum: Number(b.pencilNo),
    Notes: b.notes || '',
  }));

const formatGetInFitUp = (bookings) =>
  bookings.map((b) => ({
    Id: b.id,
    StatusCode: b.bookingStatus,
    VenueId: b.venue,
    PencilNum: Number(b.pencilNo),
    Notes: b.notes || '',
  }));

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    const bookings = req.body as BookingItem;
    const { isBooking, isGetInFitUp } = bookings[0];

    if (isBooking) {
      const formattedBookings = formatBookings(bookings);
      await Promise.all(
        formattedBookings.map(async (booking, index) => {
          const timesToUpdate = bookings[index].times;
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
    } else if (isGetInFitUp) {
      const formattedBookings = formatGetInFitUp(bookings);
      await Promise.all(
        formattedBookings.map(async (booking) => {
          await updateGetInFitUp(booking as GetInFitUp);
        }),
      );
    }

    res.status(200).json('Success');
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
}
