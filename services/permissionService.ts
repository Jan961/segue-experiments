import prisma from 'lib/prisma';
import { AccountUser, PermissionGroup } from '@prisma/client';

/* const prisma = new PrismaClient().$extends({
  model: {
    permissionGroup: {
      findMany: async (args?: Prisma.PermissionGroupFindManyArgs) => {
        return prisma.permissionGroup.findMany(args);
      },
    },
  },
}); */

const formatPermissions = (data) => {
  if (!data || data.length === 0) {
    return [];
  }
  return data.reduce((acc, value) => {
    const item = {
      id: value.Id,
      name: value.Name,
      options: value.Permission?.map((p) => ({ id: p.Id, value: p.Id, label: p.Name })) || [],
    };

    return [...acc, item];
  }, []);
};

const formatAccountUsers = (data) => {
  if (!data || data.length === 0) {
    return [];
  }
  return data.reduce((acc, value) => {
    const item = {
      ...value,
      name: `${value.User.FirstName} ${value.User.LastName || ''}`,
      value: value.Id,
    };

    return [...acc, item];
  }, []);
};

export const getPermissionsList = async (): Promise<PermissionGroup[]> => {
  try {
    const results = await prisma.permissionGroup.findMany({
      include: {
        Permission: true,
      },
    });
    return formatPermissions(results);
  } catch (err) {
    console.log('Error fetching permissions ', err);
  }
};

export const getAccountUsersList = async (): Promise<AccountUser[]> => {
  try {
    const results = await prisma.AccountUser.findMany({
      include: {
        User: { select: { Email: true, FirstName: true, LastName: true } },
        Account: { select: { AccountName: true } },
      },
    });

    return formatAccountUsers(results);
  } catch (err) {
    console.log('Error fetching account users ', err);
  }
};
