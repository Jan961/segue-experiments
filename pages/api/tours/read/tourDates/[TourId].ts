import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

/**
 *
 * Return a list of Dates within a tour that are "gaps"
 * A gap is a day that is within the tour (Between Tour Start and tour End)
 * that is not set as rehersal, show of fit-up
 *
 *
 * @param req TourID
 * @param res
 */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const TourId = parseInt(req.query.TourId as string);

  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, { TourId });
  if (!access) return res.status(401).end();

  // Simole qyerey to get the tour Start and End Date
  const tourdates = await prisma.tour.findFirst({
    where: {
      TourId,
    },
  });

  const result = await prisma.booking.findMany({
    where: {
      AND: [
        { TourId },
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
             * Use Dates from simple query to create constraint of Tour Start And End
             */
            gte: tourdates.TourStartDate,
            lte: tourdates.TourEndDate,
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
