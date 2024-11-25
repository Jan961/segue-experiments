import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { ActivityDTO } from 'interfaces';
import { newDate, safeDate } from 'services/dateService';
import { UTCDate } from '@date-fns/utc';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as ActivityDTO;
    const prisma = await getPrismaClient(req);

    const result = await prisma.bookingActivity.create({
      data: {
        Date: data.Date ? safeDate(data.Date) : null,
        Name: data.Name,
        ActivityType: {
          connect: {
            Id: data.ActivityTypeId,
          },
        },
        CreatedDT: newDate(),
        DueByDate: data.DueByDate ? safeDate(data.DueByDate) : null,
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

    const formattedResult = {
      Id: result.Id,
      BookingId: result.BookingId,
      Date: new UTCDate(result.Date),
      Name: result.Name,
      ActivityTypeId: result.ActivityTypeId,
      CompanyCost: Number(result.CompanyCost),
      VenueCost: Number(result.VenueCost),
      FollowUpRequired: result.FollowUpRequired,
      DueByDate: new UTCDate(result.DueByDate),
      Notes: result.Notes,
    };

    res.status(200).json(formattedResult);
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error creating BookingActivity' });
  }
}
