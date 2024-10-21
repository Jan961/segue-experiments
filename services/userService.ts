import { clerkClient } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import prisma from 'lib/prisma_master';
import { userMapper } from 'lib/mappers';
import { UserDto } from 'interfaces';
import { isNullOrEmpty } from 'utils';

export const getUsers = async (AccountId: number): Promise<UserDto[]> => {
  const result = await prisma.user.findMany({
    where: {
      AccountUser: {
        some: {
          AccUserAccountId: AccountId,
        },
      },
    },
    select: {
      UserId: true,
      UserEmail: true,
      UserFirstName: true,
      UserLastName: true,
      AccountUser: {
        where: {
          AccUserAccountId: AccountId,
        },
        select: {
          AccUserId: true,
        },
        take: 1,
      },
    },
  });

  return result.map(userMapper);
};

export const getUsersWithPermissions = async (AccountId: number) => {
  const users = await prisma.AccountUserPermissionsView.findMany({
    where: {
      AccountId,
    },
  });

  const formattedUsers = users
    .map((user) => {
      const firstName = user.UserFirstName || '';
      const lastName = user.UserLastName || '';

      return {
        accountUserId: user.AccUserId,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email: user.UserEmail,
        isSystemAdmin: user.AccUserIsAdmin,
        pin: user.AccountPIN,
        permissions: user.AllPermissions,
        permissionDesc: user.AllPermissions,
        licence: 'Standard',
      };
    })
    .sort((a, b) => a.lastName.localeCompare(b.lastName));
  return formattedUsers;
};

export const getEmailAddressForClerkId = async (userId: string): Promise<string> => {
  const user = await clerkClient.users.getUser(userId);
  const matching = user.emailAddresses.filter((x) => x.id === user.primaryEmailAddressId)[0];
  return matching.emailAddress;
};

export const getUserNameForClerkId = async (userId: string): Promise<string> => {
  const user = await clerkClient.users.getUser(userId);
  const matching = user.emailAddresses.filter((x) => x.id === user.primaryEmailAddressId)[0];
  const accountId = await getAccountId(matching.emailAddress);
  const users = await getUsers(accountId);
  const currentUser = users.find((user) => user.Email === matching.emailAddress);
  const firstname = isNullOrEmpty(currentUser.FirstName) ? '' : currentUser.FirstName;
  const lastname = isNullOrEmpty(currentUser.LastName) ? '' : currentUser.LastName;
  return firstname + ' ' + lastname;
};

export const getAccountId = async (email: string) => {
  const response = await prisma.user.findUnique({
    where: {
      UserEmail: email,
    },
    select: {
      AccountUser: {
        select: {
          AccUserAccountId: true,
        },
      },
    },
  });

  return response?.AccountUser[0]?.AccUserAccountId;
};

export const getEmailFromReq = async (req: any) => {
  // It is definitely worth caching this!
  const { userId } = getAuth(req);
  return getEmailAddressForClerkId(userId);
};

export const getUserNameFromReq = async (req: any) => {
  const { userId } = getAuth(req);
  return getUserNameForClerkId(userId);
};

export const getAccountIdFromReq = async (req: any) => {
  const email = await getEmailFromReq(req);
  return getAccountId(email);
};

export const getOrganisationIdFromReq = async (req: any) => {
  const { userId } = getAuth(req);
  const user = await clerkClient.users.getUser(userId);
  return user?.unsafeMetadata?.organisationId;
};

export const getUserId = async (email: string) => {
  const { UserId } = await prisma.user.findUnique({
    where: {
      UserEmail: email,
    },
    select: {
      UserId: true,
    },
  });

  return UserId;
};

export const createClerkUserWithoutSession = async (
  emailAddress: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  const response = await clerkClient.users.createUser({
    emailAddress: [emailAddress],
    password,
    firstName,
    lastName,
  });
  return response;
};

export const getUserPermisisons = async (email: string, organisationId: string) => {
  const accountUser = await prisma.AccountUser.findFirst({
    where: {
      User: {
        UserEmail: {
          equals: email,
        },
      },
      Account: {
        AccountOrganisationId: {
          equals: organisationId,
        },
      },
    },
    select: {
      Account: true,
      AccountUserPermission: {
        select: {
          Permission: true,
        },
      },
    },
  });
  const formattedPermissions =
    accountUser?.AccountUserPermission.map(({ Permission }) => Permission.PermissionName) || [];
  return formattedPermissions;
};
