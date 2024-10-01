import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { getInFitUpMapper } from 'lib/mappers';

export interface CreateGifuParams {
  DateBlockId: number;
  Date: string;
  VenueId: number;
  RunTag: string;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const gifu = req.body as CreateGifuParams;
    const { DateBlockId, VenueId } = gifu;
    const prisma = await getPrismaClient(req);

    const result = await prisma.getInFitUp.create({
      data: {
        RunTag: gifu.RunTag,
        Date: new Date(gifu.Date),
        DateBlock: {
          connect: {
            Id: DateBlockId,
          },
        },
        Venue: {
          connect: {
            Id: VenueId,
          },
        },
      },
    });
    res.status(200).json(getInFitUpMapper(result));
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error Creating GIFU' });
  }
}
