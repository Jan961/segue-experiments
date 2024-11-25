import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { GlobalActivityDTO } from 'interfaces';
import { convertDate } from 'lib/mappers';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export type GlobalActivitiesResponse = {
  activities: GlobalActivityDTO[];
  activityTypes: Array<SelectOption>;
};

let prisma = null;

const getActivitiesByVenueId = async (VenueId: number) => {
  // activity types
  const activityTypes = await prisma.activityType.findMany({
    select: {
      Name: true,
      Id: true,
    },
    orderBy: {
      Name: 'asc',
    },
  });

  // First fetch the GlobalActivityIds related to the given VenueId
  const activityIdsResult = await prisma.globalBookingActivityVenue.findMany({
    where: {
      VenueId,
    },
    select: {
      GlobalActivityId: true,
    },
  });

  const activityIds = activityIdsResult.map((item) => item.GlobalActivityId);

  // Fetch activities related to the fetched GlobalActivityIds
  const activities = await prisma.globalBookingActivity.findMany({
    where: {
      Id: {
        in: activityIds,
      },
    },
    include: {
      GlobalBookingActivityVenue: true, // Include related venue data
    },
  });

  // Process activities to aggregate VenueIds and count them
  const activitiesWithVenueList = activities.map((activity) => {
    const venueIds = activity.GlobalBookingActivityVenue.map((venue) => venue.VenueId);
    return {
      ...activity,
      VenueIds: venueIds,
      VenueCount: venueIds.length,
    };
  });

  // Map fields to the required format
  const result = {
    activities: activitiesWithVenueList.map((activity) => fieldsMapper(activity)),
    activityTypes,
  };

  return result;
};

const fieldsMapper = (original) => ({
  Id: original.Id,
  ProductionId: original.ProductionId,
  Date: convertDate(original.Date),
  Name: original.Name,
  ActivityTypeId: original.ActivityTypeId,
  Cost: Number(original.VenueCount) === 0 ? 0 : Number(original.Cost) / Number(original.VenueCount),
  FollowUpRequired: original.FollowUpRequired,
  DueByDate: convertDate(original.DueByDate),
  Notes: original.Notes,
  VenueIds: original.VenueIds,
});

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const VenueId = parseInt(req.query.VenueId as string);
    prisma = await getPrismaClient(req);

    const result = await getActivitiesByVenueId(VenueId);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while querying for Global Activities by VenueId.' });
  }
}
