import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { ActivityDTO } from 'interfaces';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as ActivityDTO;
    const prisma = await getPrismaClient(req);

    await prisma.bookingActivity.update({
      where: {
        Id: data.Id,
      },
      data: {
        Date: new Date(data.Date),
        Name: data.Name,
        ActivityType: {
          connect: {
            Id: data.ActivityTypeId,
          },
        },
        CompanyCost: data.CompanyCost,
        VenueCost: data.VenueCost,
        FollowUpRequired: data.FollowUpRequired,
        DueByDate: data.DueByDate,
        Notes: data.Notes,
      },
    });
    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error updating BookingActivity' });
  }
}
