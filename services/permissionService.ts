import prismaMaster from 'lib/prisma_master';
import getPrismaClient from 'lib/prisma';
import { isNullOrEmpty } from 'utils';
import { getOrganisationIdFromReq } from './userService';
import { NextApiRequest } from 'next';

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

function findOptionById(item, id) {
  if (item.id === id) {
    return item;
  }
  for (const option of item.options) {
    if (option.id === id) {
      return option;
    }
    if (!isNullOrEmpty(option.options)) {
      const found = findOptionById(option, id);
      if (found) {
        return found;
      }
    }
  }
  return null; // Return null if the item is not found
}

const formatPermission = (permission) => {
  return {
    id: permission.PermissionId,
    name: permission.PermissionName,
    label: permission.PermissionDescription,
    value: permission.PermissionId,
    parentId: permission.PermissionParentPermissionId || null,
    groupHeader: !permission.PermissionParentPermissionId,
    seqNo: permission.PermissionSeqNo,
    options: [],
  };
};

const formatPermissions = (permissions) => {
  if (!permissions) {
    return [];
  }

  const formattedResults = permissions.reduce((acc, permission) => {
    const formattedItem = formatPermission(permission);
    if (!formattedItem.parentId) {
      acc.push(formattedItem);
    } else {
      acc.forEach((item) => {
        const parentItem = findOptionById(item, formattedItem.parentId);
        if (parentItem) {
          parentItem.options.push(formattedItem);
        }
      });
    }
    return acc;
  }, []);

  return formattedResults;
};

const sortPermissionsHierarchy = (items, topLevelIds) => {
  // Create a map to store items by their id for quick lookup
  const itemMap = new Map();
  items.forEach((item) => itemMap.set(item.PermissionId, { ...item, children: [] }));

  // Build the hierarchy by assigning each item to its parent's children array
  items.forEach((item) => {
    if (item.PermissionParentPermissionId) {
      const parent = itemMap.get(item.PermissionParentPermissionId);
      if (parent) {
        parent.children.push(itemMap.get(item.PermissionId));
      }
    }
  });

  // Function to recursively add parent-children items in order
  const addInOrder = (item, result) => {
    result.push({
      ...item,
      PermissionId: item.PermissionId,
      PermissionParentPermissionId: item.PermissionParentPermissionId,
    });
    item.children.forEach((child) => addInOrder(child, result));
  };

  // Collect sorted items
  const sortedItems = [];
  topLevelIds.forEach(({ PermissionId }) => {
    const topLevelItem = itemMap.get(PermissionId);
    if (topLevelItem) addInOrder(topLevelItem, sortedItems);
  });

  return sortedItems;
};

export const getPermissionsList = async () => {
  try {
    const results = await prismaMaster.permission.findMany({ orderBy: { PermissionParentPermissionId: 'asc' } });
    // Build the hierarchy
    const topLevelItems = results.filter((item) => item.PermissionParentPermissionId === null);
    const sortedResults = sortPermissionsHierarchy(results, topLevelItems);
    return formatPermissions(sortedResults);
  } catch (err) {
    console.log('Error fetching permissions ', err);
  }
};

export const getAccountUsersList = async () => {
  try {
    const results = await prismaMaster.AccountUser.findMany({
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

export const replaceUserPermissions = async (accountUserId: string, permissionIds: string[]) => {
  await prismaMaster.$transaction(async (tx) => {
    await tx.AccountUserPermission.deleteMany({
      where: {
        UserAuthAccUserId: accountUserId,
      },
    });

    await tx.AccountUserPermission.createMany({
      data: permissionIds.map((permissionId) => ({
        UserAuthAccUserId: accountUserId,
        UserAuthPermissionId: permissionId,
      })),
    });
  });
};

export const replaceProudctionPermissions = async (
  accountUserId: string,
  productionIds: string[],
  req: NextApiRequest,
) => {
  const prismaClient = await getPrismaClient(req);
  await prismaClient.$transaction(async (tx) => {
    await tx.accountUserProduction.deleteMany({
      where: {
        AUPAccUserId: Number(accountUserId),
      },
    });

    await tx.accountUserProduction.createMany({
      data: productionIds.map((productionId) => ({
        AUPAccUserId: Number(accountUserId),
        AUPProductionId: Number(productionId),
      })),
    });
  });
};

const formatPermisisonGroups = (permissionGroups) => {
  const formatted = permissionGroups.reduce((acc, group) => {
    const { PermissionGroupPermission } = group;
    const formattedGroup = {
      groupId: group.PerGpId,
      groupName: group.PerGpName,
      permissions: PermissionGroupPermission.map(({ Permission }) => ({
        id: Permission.PermissionId,
        name: Permission.PermissionName,
      })),
    };
    return [...acc, formattedGroup];
  }, []);
  return formatted;
};

export const getPermissionGroupsList = async (req) => {
  try {
    const organisationId = getOrganisationIdFromReq(req);
    const results = await prismaMaster.PermissionGroup.findMany({
      where: {
        PerGpAccountId: organisationId,
      },
      include: {
        PermissionGroupPermission: {
          include: {
            Permission: {
              select: { PermissionId: true, PermissionName: true },
            },
          },
        },
      },
    });
    const formattedGroups = formatPermisisonGroups(results);

    return formattedGroups;
  } catch (err) {
    console.log('Error fetching permission groups', err);
  }
};

export const getAllPermissionsWithIdAndName = async () => {
  return await prismaMaster.permission.findMany({
    select: {
      PermissionId: true,
      PermissionName: true,
    },
  });
};
