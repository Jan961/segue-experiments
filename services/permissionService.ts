import prisma from 'lib/prisma_master';
import { isNullOrEmpty } from 'utils';

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
    label: permission.PermissionName,
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

export const getPermissionsList = async () => {
  try {
    const results = await prisma.permission.findMany();
    return formatPermissions(results);
  } catch (err) {
    console.log('Error fetching permissions ', err);
  }
};

export const getAccountUsersList = async (): Promise<any[]> => {
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
