import { AccountSubscription } from '@prisma/client';
import prisma from 'lib/prisma';
import { omit } from 'radash';
export const createSubscription = async (subscriptionDetails: Partial<AccountSubscription>, tx = prisma) => {
  const newSubscription = await tx.accountSubscription.create({
    data: {
      ...omit(subscriptionDetails, ['AccountSubscriptionId']),
    },
  });
  return newSubscription;
};
