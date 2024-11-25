import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { GlobalActivity } from 'components/marketing/modal/GlobalActivityModal';
import { safeDate } from 'services/dateService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as GlobalActivity;
    const prisma = await getPrismaClient(req);

    await prisma.$transaction(async (prisma) => {
      await updateGlobalBookingActivity(prisma, data);
      await updateGlobalBookingActivityVenues(prisma, data);
    });

    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.error(err);
    res.status(500).json({ err: 'Error updating BookingActivity' });
  }
}

async function updateGlobalBookingActivity(prisma, data: GlobalActivity) {
  await prisma.globalBookingActivity.update({
    where: { Id: data.Id },
    data: {
      Date: safeDate(data.Date),
      Name: data.Name,
      ActivityType: { connect: { Id: data.ActivityTypeId } },
      Cost: data.Cost,
      FollowUpRequired: data.FollowUpRequired,
      DueByDate: data.DueByDate,
      Notes: data.Notes,
    },
  });
}

async function updateGlobalBookingActivityVenues(prisma, data: GlobalActivity) {
  const newIdList = data.VenueIds.filter((id) => id !== 0);

  const currentVenues = await prisma.globalBookingActivityVenue.findMany({
    where: { GlobalActivityId: data.Id },
    select: { VenueId: true },
  });

  const currentVenueIds = currentVenues.map((venue) => venue.VenueId);
  const venuesToRemove = currentVenueIds.filter((venueId) => !newIdList.includes(venueId));
  const venuesToAdd = newIdList.filter((venueId) => !currentVenueIds.includes(venueId));

  if (venuesToRemove.length > 0) {
    await prisma.globalBookingActivityVenue.deleteMany({
      where: {
        GlobalActivityId: data.Id,
        VenueId: { in: venuesToRemove },
      },
    });
  }

  if (venuesToAdd.length > 0) {
    const createData = venuesToAdd.map((venueId) => ({
      GlobalActivityId: data.Id,
      VenueId: venueId,
    }));
    await prisma.globalBookingActivityVenue.createMany({ data: createData });
  }
}
