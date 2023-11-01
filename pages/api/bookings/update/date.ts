import { BookingDTO, PerformanceDTO } from 'interfaces';
import { bookingMapper, performanceMapper } from 'lib/mappers';
import { NextApiRequest, NextApiResponse } from 'next';
import { changeBookingDate } from 'services/bookingService';
import { checkAccess, getEmailFromReq } from 'services/userService';

export interface UpdateDateParams {
  date: string;
  bookingId: number;
}

export interface UpdateDateResponse {
  bookings: BookingDTO[];
  performances: PerformanceDTO[];
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { bookingId, date } = req.body as UpdateDateParams;

  try {
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId: bookingId });
    if (!access) return res.status(401).end();

    const result = await changeBookingDate(bookingId, new Date(date));

    const response: UpdateDateResponse = {
      bookings: [bookingMapper(result)],
      performances: result.Performance.map(performanceMapper),
    };

    if (result) {
      return res.status(200).json(response);
    }
    return res.status(404).json({});
  } catch (e) {
    console.log(e);
    return res.status(500).json({ err: 'Error updating date' });
  }
}
