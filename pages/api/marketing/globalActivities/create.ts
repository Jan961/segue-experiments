import { loggingService } from 'services/loggingService';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    const newGlobalBookingActivity = await prisma.globalBookingActivity.create({
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

    res.status(200).json(data);
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error creating GlobalActivity' });
  }
}
