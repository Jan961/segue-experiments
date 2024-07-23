import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { GlobalActivityDTO } from 'interfaces';
import { convertDate } from 'lib/mappers';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export type GlobalActivitiesResponse = {
  activities: GlobalActivityDTO[];
  activityTypes: Array<SelectOption>;
};

export const getActivitiesByVenueId = async (VenueId: number) => {
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
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    const result = await getActivitiesByVenueId(VenueId);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while querying for Global Activities by VenueId.' });
  }
}
