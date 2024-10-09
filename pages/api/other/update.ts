import getPrismaClient from 'lib/prisma';
import { OtherDTO } from 'interfaces';
import { otherMapper } from 'lib/mappers';

export default async function handle(req, res) {
  try {
    const other = req.body as OtherDTO;
    const prisma = await getPrismaClient(req);

    const result = await prisma.other.update({
      where: {
        Id: other.Id,
      },
      data: {
        DateType: {
          connect: {
            Id: other.DateTypeId,
          },
        },
        StatusCode: other.StatusCode,
      },
    });

    res.status(200).json(otherMapper(result));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occured while updating other' });
  }
}
