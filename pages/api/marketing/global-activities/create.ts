import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { newDate } from 'services/dateService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body;
    const prisma = await getPrismaClient(req);

    const newGlobalBookingActivity = await prisma.globalBookingActivity.create({
      data: {
        Date: data.Date ? newDate(data.Date) : null,
        Name: data.Name,
        ActivityType: {
          connect: {
            Id: data.ActivityTypeId,
          },
        },
        CreatedDT: newDate(),
        DueByDate: data.DueByDate ? newDate(data.DueByDate) : null,
        Notes: data.Notes,
        ProductionId: data.ProductionId,
        Cost: data.Cost,
        FollowUpRequired: data.FollowUpRequired,
      },
    });

    // remove venueId 0 - this is the checkbox indicatator for all
    const newIds = data.VenueIds.filter((id) => id !== 0);

    const globalBookingActivityVenueRecords = newIds.map((venueId) => {
      return {
        GlobalActivityId: newGlobalBookingActivity.Id,
        VenueId: venueId,
      };
    });

    await prisma.globalBookingActivityVenue.createMany({
      data: globalBookingActivityVenueRecords,
    });

    res.status(200).json(newGlobalBookingActivity);
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error creating GlobalActivity' });
  }
}
