import { loggingService } from 'services/loggingService';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { ActivityDTO } from 'interfaces';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as ActivityDTO;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId: data.BookingId });
    if (!access) return res.status(401).end();

    await prisma.bookingActivity.create({
      data: {
        Id: data.Id,
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
        Booking: {
          connect: {
            Id: data.BookingId,
          },
        },
        CompanyCost: data.CompanyCost,
        VenueCost: data.VenueCost,
        FollowUpRequired: data.FollowUpRequired,
      },
    });
    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error creating BookingActivity' });
  }
}
