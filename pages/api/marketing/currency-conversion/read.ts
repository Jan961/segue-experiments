import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrencyFromBookingId, getCurrencyFromProductionId } from 'services/venueCurrencyService';
import getPrismaClient from 'lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { bookingId, productionId } = req.query;
    if (!bookingId || !productionId) return res.status(400).end();
    const prisma = await getPrismaClient(req);

    const bookingSymbol = await getCurrencyFromBookingId(req, parseInt(bookingId.toString()), true);
    const productionSymbol = await getCurrencyFromProductionId(req, parseInt(productionId.toString()), true);

    // if either currency code is blank return 1 so there is no change to as a result of the conversion
    if (!bookingSymbol || !productionSymbol) {
      res.status(200).json({ conversion: 1 });
    } else {
      const currencyConversion = await prisma.conversionRate.findFirst({
        where: {
          ProductionId: parseInt(productionId.toString()),
          FromCurrencyCode: bookingSymbol,
          ToCurrencyCode: productionSymbol,
        },
        select: {
          Rate: true,
        },
      });

      const result = currencyConversion?.Rate || 1;
      res.status(200).json({ conversion: result });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, ok: false });
  }
}
