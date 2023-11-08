import prisma from 'lib/prisma';

export const getRoles = async () => {
  return prisma.venueRole.findMany();
};
