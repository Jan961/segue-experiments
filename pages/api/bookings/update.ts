import { NextApiRequest, NextApiResponse } from 'next';
import { updateBooking } from 'services/bookingService';
import { BookingDTO } from 'interfaces';
import { Booking } from '@prisma/client';
import { bookingMapper } from 'lib/mappers';
import { checkAccess, getEmailFromReq } from 'services/userService';
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const inc = req.body as BookingDTO;
    const { Id, Date: FirstDate, StatusCode, VenueId, PencilNum, Notes } = inc;
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId: inc.Id });
    if (!access) return res.status(401).end();
    const booking: Partial<Booking> = {
      Id,
      ...(FirstDate && { FirstDate: new Date(FirstDate) }),
      ...(StatusCode && { StatusCode }),
      ...(VenueId && { VenueId }),
      ...(PencilNum && { PencilNum }),
      ...(Object.prototype.hasOwnProperty.call(inc, 'Notes') && { Notes }),
    };
    const updated = await updateBooking(booking as Booking);
    const mapped = bookingMapper(updated);
    res.status(200).json(mapped);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
}
