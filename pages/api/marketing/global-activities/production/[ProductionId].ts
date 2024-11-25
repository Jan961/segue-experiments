import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { GlobalActivityDTO } from 'interfaces';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { dateToSimple } from 'services/dateService';

export type GlobalActivitiesResponse = {
  activities: GlobalActivityDTO[];
  activityTypes: Array<SelectOption>;
};

let prisma = null;

const getActivitiesByProductionId = async (ProductionId) => {
  const activityTypes = await prisma.activityType.findMany({
    select: {
      Name: true,
      Id: true,
    },
    orderBy: {
      Name: 'asc',
    },
  });

  // Fetch main activity data
  const activities = await prisma.globalBookingActivity.findMany({
    where: {
      ProductionId,
    },
    include: {
      GlobalBookingActivityVenue: true, // Include related data
    },
  });

  // Process the data to mimic GROUP_CONCAT
  const processedActivities = activities.map((activity) => {
    const { GlobalBookingActivityVenue, ...otherFields } = activity;
    const venueIds = GlobalBookingActivityVenue.map((venue) => venue.VenueId).join(',');
    return {
      ...otherFields,
      VenueIds: venueIds,
    };
  });

  const result = {
    activityTypes: activityTypes.map((type) => {
      return { text: type.Name, value: type.Id };
    }),
    activities: processedActivities.map((activity) => {
      return fieldsMapper(activity);
    }),
  };

  return result;
};

const fieldsMapper = (original) => ({
  Id: original.Id,
  ProductionId: original.ProductionId,
  Date: dateToSimple(original.Date),
  Name: original.Name,
  ActivityTypeId: original.ActivityTypeId,
  Cost: Number(original.Cost),
  FollowUpRequired: original.FollowUpRequired,
  DueByDate: dateToSimple(original.DueByDate),
  Notes: original.Notes,
  VenueIds: original.VenueIds === null ? null : original.VenueIds.split(',').map(Number),
});

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ProductionId = parseInt(req.query.ProductionId as string);
    prisma = await getPrismaClient(req);

    const result = await getActivitiesByProductionId(ProductionId);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}
