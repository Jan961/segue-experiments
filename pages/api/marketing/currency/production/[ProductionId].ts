import { NextApiRequest, NextApiResponse } from 'next';
import { getCurrencyFromProductionId } from 'services/venueCurrencyService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { ProductionId } = req.query;
    if (!ProductionId) return res.status(400).end();

    const currencySymbol = (await getCurrencyFromProductionId(req, parseInt(ProductionId.toString()))) || '';

    res.status(200).json({ currency: currencySymbol });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err, ok: false });
  }
}
