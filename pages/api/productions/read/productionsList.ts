import { NextApiRequest, NextApiResponse } from 'next';
import { getAllProductions } from 'services/productionService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const productionsRaw = await getAllProductions(req);

    const values = {
      productions: productionsRaw.map((t: any) => ({
        Id: t.Id,
        Code: t.Code,
        IsArchived: t.IsArchived,
        ShowCode: t.Show.Code,
        ShowName: t.Show.Name,
        SalesFrequency: t.SalesFrequency,
      })),
    };
    return res.status(200).json(values);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while getting account id' });
  }
}
