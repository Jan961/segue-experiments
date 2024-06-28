import { loggingService } from 'services/loggingService';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { GlobalActivityDTO } from 'interfaces';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as GlobalActivityDTO;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    await prisma.globalBookingActivity.create({
      data: {
        data: data.Id,
        Date: data.Date ? new Date(data.Date) : null,
        Name: data.Name,
        ActivityType: {
          connect: {
            Id: data.ActivityTypeId,
          },
        },
        CreatedDT: new Date(),
        DueByDate: data.DueByDate ? new Date(data.DueByDate) : null,
        Notes: data.Notes,
        ProductionId: data.ProductionId,
        Cost: data.Cost,
        FollowUpRequired: data.FollowUpRequired,
      },
    });

    res.status(200).json(data);
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error creating GlobalActivity' });
  }
}
