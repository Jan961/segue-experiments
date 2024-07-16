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

export const getActivitiesByProductionId = async (ProductionId) => {
  const activityTypes = await prisma.activityType.findMany({
    select: {
      Name: true,
      Id: true,
    },
    orderBy: {
      Name: 'asc',
    },
  });

  const activities = await prisma.$queryRaw`SELECT 
        gba.*,
        GROUP_CONCAT(gbav.GBAVVenueId) AS VenueIds
    FROM 
        GlobalBookingActivity gba
    LEFT JOIN 
        GlobalBookingActivityVenue gbav
    ON 
        gba.GlobalActivityId = gbav.GBAVGlobalActivityId
    WHERE 
        gba.GlobalActivityProductionId = ${ProductionId}
    GROUP BY 
        gba.GlobalActivityId;
    `;

  const result = {
    activityTypes: activityTypes.map((type) => {
      return { text: type.Name, value: type.Id };
    }),
    activities: activities.map((activity) => {
      return fieldsMapper(activity);
    }),
  };

  return result;
};

const fieldsMapper = (original) => ({
  Id: original.GlobalActivityId,
  ProductionId: original.GlobalActivityProductionId,
  Date: convertDate(original.GlobalActivityDate),
  Name: original.GlobalActivityName,
  ActivityTypeId: original.GlobalActivityActivityTypeId,
  Cost: Number(original.GlobalActivityCost),
  FollowUpRequired: original.GlobalActivityFollowUpRequired,
  DueByDate: convertDate(original.GlobalActivityDueByDate),
  Notes: original.GlobalActivityNotes,
  VenueIds: original.VenueIds === null ? null : original.VenueIds.split(',').map(Number),
});

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ProductionId = parseInt(req.query.ProductionId as string);
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    const result = await getActivitiesByProductionId(ProductionId);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}
