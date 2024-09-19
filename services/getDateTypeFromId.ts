import prisma from 'lib/prisma';
export const getDateTypeFromId = async (id: number) => {
  return (await prisma.DateType.findFirst({ where: { Id: id }, select: { Name: true } }))?.Name;
};
