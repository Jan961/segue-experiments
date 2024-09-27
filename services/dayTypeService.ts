import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';

export const getDayTypes = async (req: NextApiRequest) => {
  try {
    const prisma = getPrismaClient(req);
    return prisma.dateType.findMany({
      orderBy: {
        SeqNo: 'asc',
      },
    });
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getDateTypeFromId = async (id: number, req: NextApiRequest) => {
  try {
    const prisma = getPrismaClient(req);

    return (await prisma.DateType.findFirst({ where: { Id: id }, select: { Name: true } }))?.Name;
  } catch (err) {
    console.log(err);
    return null;
  }
};
