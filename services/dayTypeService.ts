import getPrismaClient from 'lib/prisma';

export const getDayTypes = async () =>
  prisma.dateType.findMany({
    orderBy: {
      SeqNo: 'asc',
    },
  });

export const getDateTypeFromId = async (id: number) => {
  return (await prisma.DateType.findFirst({ where: { Id: id }, select: { Name: true } }))?.Name;
};
