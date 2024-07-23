import { clerkClient } from '@clerk/nextjs';
import { getAuth } from '@clerk/nextjs/server';
import prisma from 'lib/prisma';
import { AccessCheck, checkAccess as checkAccessDirect } from './accessService';
import { userMapper } from 'lib/mappers';
import { UserDto } from 'interfaces';
import { isNullOrEmpty } from 'utils';

export const getUsers = async (AccountId: number): Promise<UserDto[]> => {
  const result = await prisma.user.findMany({
    where: {
      AccountId,
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
  const currentUser = users.find((user) => user.Email === matching.emailAddress);
  const firstname = isNullOrEmpty(currentUser.FirstName) ? '' : currentUser.FirstName;
  const lastname = isNullOrEmpty(currentUser.LastName) ? '' : currentUser.LastName;
  return firstname + ' ' + lastname;
};

export const getAccountId = async (email: string) => {
  const { AccountId } = await prisma.user.findUnique({
    where: {
      Email: email,
    },
    select: {
      AccountId: true,
    },
  });

  return AccountId;
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
  const { Id } = await prisma.user.findUnique({
    where: {
      Email: email,
    },
    select: {
      Id: true,
    },
  });

  return Id;
};
