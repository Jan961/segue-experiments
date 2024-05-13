import { loggingService } from 'services/loggingService';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { ActivityDTO } from 'interfaces';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as ActivityDTO;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { ActivityId: data.Id });
    if (!access) return res.status(401).end();

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
      },
    });
    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error updating BookingActivity' });
  }
}
