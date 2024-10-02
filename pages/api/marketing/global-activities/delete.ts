import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { GlobalActivity } from 'components/marketing/modal/GlobalActivityModal';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as GlobalActivity;
    const prisma = await getPrismaClient(req);

    await prisma.globalBookingActivity.delete({
      where: {
        Id: data.Id,
      },
    });

    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error deleting BookingActivity' });
  }
}
