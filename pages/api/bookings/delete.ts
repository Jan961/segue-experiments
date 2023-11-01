import { deleteBookingById } from 'services/bookingService';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAccess, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.body.bookingId);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();

    await deleteBookingById(BookingId);

    console.log(`Deleted: ${BookingId}`);
    return res.status(200).json({});
  } catch (e) {
    console.log(e);
    return res.status(500).json({ err: 'Error Deleting Booking' });
  }
}
