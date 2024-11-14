import getPrismaClient from 'lib/prisma';
import { getArchivedSalesList } from 'services/marketing/archivedSales';

import { getCurrencyFromBookingId } from 'services/venueCurrencyService';

let prisma = null;

export default async function handle(req, res) {
  try {
    prisma = await getPrismaClient(req);
    const bookingIds: number[] = req.body.bookingIds;
    if (!bookingIds) {
      throw new Error('Params are missing');
    }
    const currencySymbol = (await getCurrencyFromBookingId(req, bookingIds[0])) || '';
    const archivedSalesList = await getArchivedSalesList(bookingIds, currencySymbol, prisma, 300);

    res.status(200).json(archivedSalesList);
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while generating search results.', message: error.message });
  }
}
