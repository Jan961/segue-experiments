import { NextApiRequest, NextApiResponse } from 'next';
import { all } from 'radash';
import {
  getAllProductionRegions,
  getUserAccessibleProductions,
  transformProductions,
} from 'services/productionService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const orgId = req.query.organisationId as string;
    const [productionList, allProductionRegions] = await all([
      getUserAccessibleProductions(req, orgId),
      getAllProductionRegions(req),
    ]);
    return res.status(200).json({ productionList: transformProductions(productionList, allProductionRegions) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error fetching user permissions.' });
  }
}
