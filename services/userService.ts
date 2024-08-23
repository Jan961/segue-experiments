import { clerkClient } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import prisma from 'lib/prisma_master';
import { AccessCheck, checkAccess as checkAccessDirect } from './accessService';
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
  const currentUser = users.find((user) => user.UserEmail === matching.emailAddress);
  const firstname = isNullOrEmpty(currentUser.UserFirstName) ? '' : currentUser.UserFirstName;
  const lastname = isNullOrEmpty(currentUser.UserLastName) ? '' : currentUser.UserLastName;
  return firstname + ' ' + lastname;
};

export const getAccountId = async (email: string) => {
  const { AccountUser } = await prisma.user.findUnique({
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

  return AccountUser?.AccUserAccountId;
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

export const checkAccess = async (email: string, items: AccessCheck = null): Promise<boolean> => {
  return checkAccessDirect(email, items);
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
