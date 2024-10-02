import { NextApiRequest, NextApiResponse } from 'next';
import { replaceProudctionPermissions } from 'services/permissionService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { accountUserId, productionIds } = req.body;
    const results = await replaceProudctionPermissions(accountUserId, productionIds, req);
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating permissions.' + err });
  }
}
