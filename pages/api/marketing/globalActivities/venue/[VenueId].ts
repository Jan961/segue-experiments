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

export const getActivitiesByVenueId = async (VenueId) => {
  const activities = await prisma.$queryRaw`SELECT 
        gba.*,
        GROUP_CONCAT(gbav.GBAVVenueId) AS VenueIds,
        COUNT(DISTINCT gbav.GBAVVenueId) AS VenueCount
    FROM 
        GlobalBookingActivity gba
    JOIN 
        GlobalBookingActivityVenue gbav
    ON 
        gba.GlobalActivityId = gbav.GBAVGlobalActivityId
    WHERE 
        gbav.GBAVGlobalActivityId IN (
            SELECT 
                GBAVGlobalActivityId 
            FROM 
                GlobalBookingActivityVenue 
            WHERE 
                GBAVVenueId = ${VenueId}
        )
    GROUP BY 
        gba.GlobalActivityId;
    `;

  const result = {
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
  Cost: Number(original.VenueCount) === 0 ? 0 : Number(original.GlobalActivityCost) / Number(original.VenueCount),
  FollowUpRequired: original.GlobalActivityFollowUpRequired,
  DueByDate: convertDate(original.GlobalActivityDueByDate),
  Notes: original.GlobalActivityNotes,
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
