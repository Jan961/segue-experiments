import { deleteBookingById, deleteRehearsalById } from 'services/bookingService';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAccess, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { bookings } = req.body;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();
    bookings.forEach((booking) => {
      if (booking.isRehearsal) {
        await deleteRehearsalById(booking.Id);
      } else if (booking.isBooking) {
        await deleteBookingById(booking.Id);
      }
    });

    return res.status(200).json({});
  } catch (e) {
    console.log(e);
    return res.status(500).json({ err: 'Error Deleting Booking' });
  }
}
