import { NextApiRequest, NextApiResponse } from 'next';
import { getAllProductions } from 'services/productionService';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const accountId = await getAccountId(email);
    const productionsRaw = await getAllProductions(accountId);

    const values = {
      productions: productionsRaw.map((t: any) => ({
        Id: t.Id,
        Code: t.Code,
        IsArchived: t.IsArchived,
        ShowCode: t.Show.Code,
        ShowName: t.Show.Name,
      })),
    };
    return res.status(200).json(values);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while getting account id' });
  }
}
