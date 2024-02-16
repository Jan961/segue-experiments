import { NextApiRequest, NextApiResponse } from 'next';
import { updateBooking } from 'services/bookingService';
import { BookingDTO } from 'interfaces';
import { Booking } from '@prisma/client';
import { bookingMapper } from 'lib/mappers';
import { checkAccess, getEmailFromReq } from 'services/userService';
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const inc = req.body as BookingDTO;
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId: inc.Id });
    if (!access) return res.status(401).end();
    const booking: Partial<Booking> = {
      Id: inc.Id, // Where
      FirstDate: new Date(inc.Date),
      StatusCode: inc.StatusCode,
      VenueId: inc.VenueId,
      PencilNum: inc.PencilNum,
      Notes: inc.Notes,
    };
    const updated = await updateBooking(booking as Booking);
    const mapped = bookingMapper(updated);
    res.status(200).json(mapped);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 3db4262 (editing notes are possible but removing a note is not supported by the api)
