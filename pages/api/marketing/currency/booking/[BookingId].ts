import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrencyFromBookingId } from 'services/venueCurrencyService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { BookingId } = req.query;
    if (!BookingId) return res.status(400).end();

    const currencySymbol = (await getCurrencyFromBookingId(req, parseInt(BookingId.toString()))) || '';

    res.status(200).json({ currency: currencySymbol });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, ok: false });
  }
}
