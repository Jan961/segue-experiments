import { NextApiRequest, NextApiResponse } from 'next';
import { getDateBlockForProduction } from 'services/dateBlockService';

export interface DateBlockParams {
  productionId: number;
  primaryOnly?: boolean;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { productionId, primaryOnly = false } = req.body as DateBlockParams;
    const dateBlock = await getDateBlockForProduction(productionId, primaryOnly, req);
    res.status(200).json(dateBlock);
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error getting Date Block' });
  }
}
