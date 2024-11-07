import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { getDateBlockForProduction, deleteAllDateBlockEvents } from 'services/dateBlockService';

interface RequestBody {
  productionID: number;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { productionID }: RequestBody = req.body;

    if (!productionID) {
      res.status(400).json({ error: 'Invalid Production ID provided' });
    }

    // Find DateBlock for ProductionID that isPrimary
    const primaryDateBlock = await getDateBlockForProduction(productionID, true, req);
    const primaryDateBlockID = primaryDateBlock[0].Id;

    const prisma = await getPrismaClient(req);

    // Delete all associated Bookings/Rehearsals/GetInFitUp/Other events for that Primary Date Block - to be replaced.
    await deleteAllDateBlockEvents(primaryDateBlockID, prisma);

    res.status(200).json({ status: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error Creating Production File' });
  }
}
