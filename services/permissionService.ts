import prisma from 'lib/prisma';
import { PermissionGroup } from '@prisma/client';

/* const prisma = new PrismaClient().$extends({
  model: {
    permissionGroup: {
      findMany: async (args?: Prisma.PermissionGroupFindManyArgs) => {
        return prisma.permissionGroup.findMany(args);
      },
    },
  },
}); */

export const getPermissionsList = async (): Promise<PermissionGroup[]> => {
  return await prisma.permissionGroup.findMany({
    include: {
      Permission: true,
    },
  });
};
