import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
let prisma = null;
/**
 *
 * This will be a POST from loggingService which will handle the data manipulation
 *
 * Get the Latitude and Longitude for a venue
 * @param req
 * @param res
 */
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    prisma = await getPrismaClient(req);
    if (req.body != null) {
      await prisma.log.create({
        data: {
          UserId: parseInt(req.body.UserID) !== undefined ? parseInt(req.body.UserID) : 0,
          Action: req.body.Action,
          Detail: JSON.stringify(req.body.Detail),
        },
      });
    }
  } catch (e) {
    await prisma.log.create({
      data: {
        UserId: 0,
        Action: 'System Error',
        Detail:
          'An error was reported that could not be logged correctly: ' + JSON.stringify(req.body) + '  error: ' + e,
      },
    });
  }

  res.status(200).json({});
}
