import { deleteBookingById, deleteRehearsalById, deleteGetInFitUpById, deleteOtherById } from 'services/bookingService';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAccess, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bookings = req.body;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    await Promise.all(
      bookings.map(async (booking) => {
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
    return res.status(200).json('success');
  } catch (e) {
    console.log(e);
    return res.status(500).json({ err: 'Error Deleting Booking' });
  }
}
