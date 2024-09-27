import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { rehearsalMapper } from 'lib/mappers';

export interface CreateRehearsalParams {
  Date: string;
  DateBlockId: number;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const rehearsal = req.body as CreateRehearsalParams;
    const { DateBlockId } = rehearsal;

    const prisma = await getPrismaClient(req);

    const result = await prisma.rehearsal.create({
      data: {
        Date: new Date(rehearsal.Date),
        DateBlock: {
          connect: {
            Id: DateBlockId,
          },
        },
      },
    });
    console.log(`Created Rehearsal: ${result.Id}`);
    res.status(200).json(rehearsalMapper(result));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error Creating Rehearsal' });
  }
}
