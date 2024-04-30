import { NextApiRequest, NextApiResponse } from 'next';
import { checkAccess, getEmailFromReq } from 'services/userService';
import { getDateBlockForProduction } from 'services/dateBlockService';

export interface DateBlockParams {
  productionId: number;
  primaryOnly?: boolean;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();
    const { productionId, primaryOnly = false } = req.body as DateBlockParams;
    const dateBlock = await getDateBlockForProduction(productionId, primaryOnly);
    res.status(200).json(dateBlock);
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error getting Date Block' });
  }
}
