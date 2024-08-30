import { NextApiRequest, NextApiResponse } from 'next';
import master from 'lib/prisma_master';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const { currencyCodeList } = req.body;
    const results = await master.Currency.findMany({
      where: {
        CurrencyCode: {
          in: currencyCodeList,
        },
      },
    });
    const currencyList = results.map(({ CurrencyCode, CurrencyName, CurrencySymbolUnicode }) => ({
      code: CurrencyCode,
      name: CurrencyName,
      symbolUniCode: CurrencySymbolUnicode,
    }));
    res.status(200).json(currencyList);
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error fetching report' });
  }
}
