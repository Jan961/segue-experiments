import { NextApiRequest, NextApiResponse } from 'next';
import { getPerformanceCompAllocationsByBookingId } from 'services/marketing/promoterHoldsService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string);
    const { holds, allocations } = await getPerformanceCompAllocationsByBookingId(BookingId, req);
    res.json({ holds, allocations });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}
