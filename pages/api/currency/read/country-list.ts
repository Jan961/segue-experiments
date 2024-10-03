import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const prisma = await getPrismaClient(req);
    const { currencyCodeList } = req.body;
    const results = await prisma.country.findMany({
      where: {
        CurrencyCode: {
          in: currencyCodeList,
        },
      },
      include: {
        CountryInRegion: {
          include: {
            Country: true,
            Region: true,
          },
        },
      },
    });

    const countryList = results.map(({ Id, Code, Name, CurrencyCode, CountryInRegion }) => ({
      id: Id,
      code: Code,
      name: Name,
      currencyCode: CurrencyCode,
      regionList: CountryInRegion.map((cir) => {
        const { Id, Name } = cir.Region;
        return {
          id: Id,
          name: Name,
        };
      }),
    }));

    res.status(200).json(countryList);
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error fetching report' });
  }
}
