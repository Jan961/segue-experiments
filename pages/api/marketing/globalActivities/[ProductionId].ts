import { SelectOption } from 'components/core-ui-lib/Select/Select';
import { GlobalActivityDTO } from 'interfaces';
import { globalActivityMapper } from 'lib/mappers';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export type GlobalActivitiesResponse = {
  activities: GlobalActivityDTO[];
  activityTypes: Array<SelectOption>;
};

export const getActivitiesByBookingId = async (ProductionId) => {
  const activityTypes = await prisma.activityType.findMany({
    select: {
      Name: true,
      Id: true,
    },
  });

  const activities = await prisma.globalBookingActivity.findMany({
    where: {
      ProductionId,
    },
  });

  const result = {
    activityTypes: activityTypes.map((type) => {
      return { text: type.Name, value: type.Id };
    }),
    activities: activities.map(globalActivityMapper),
  };

  return result;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ProductionId = parseInt(req.query.ProductionId as string);
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    const result = await getActivitiesByBookingId(ProductionId);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}
