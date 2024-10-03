import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { GetInFitUpDTO } from 'interfaces';
import { getInFitUpMapper } from 'lib/mappers';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const gifu = req.body as GetInFitUpDTO;
    const prisma = await getPrismaClient(req);

    const result = await prisma.getInFitUp.update({
      where: {
        Id: gifu.Id,
      },
      data: {
        VenueId: gifu.VenueId,
        StatusCode: gifu.StatusCode,
      },
    });
    res.status(200).json(getInFitUpMapper(result));
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error updating GIFU' });
  }
}
