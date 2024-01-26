import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

/**
 *
 * Return a list of Dates within a production that are "gaps"
 * A gap is a day that is within the production (Between Production Start and production End)
 * that is not set as rehersal, show of fit-up
 *
 *
 * @param req ProductionID
 * @param res
 */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const ProductionId = parseInt(req.query.ProductionId as string);

  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, { ProductionId });
  if (!access) return res.status(401).end();

  // Simole qyerey to get the production Start and End Date
  const productiondates = await prisma.production.findFirst({
    where: {
      ProductionId,
    },
  });

  const result = await prisma.booking.findMany({
    where: {
      AND: [
        { ProductionId },
        /**
         * get indication of dates not currently booked
         */
        {
          VenueId: { not: null },
        },
        {
          Performance1Time: {
            not: null,
          },
        },
        {
          ShowDate: {
            /**
             * Use Dates from simple query to create constraint of Production Start And End
             */
            gte: productiondates.ProductionStartDate,
            lte: productiondates.ProductionEndDate,
          },
        },
        {
          OR: [
            /**
             * List of day types that can be used for new bookings to make sure
             * dates are not taken by Meta Days
             */
            { DateTypeId: 1 }, // Null
            { DateTypeId: 17 }, // TBA
          ],
        },
      ],
    },
    include: {
      Venue: true,
    },
  });
  res.json(result);
}
