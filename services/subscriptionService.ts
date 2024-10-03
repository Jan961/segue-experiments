import { AccountSubscription } from 'prisma/generated/prisma-master';
import prisma from 'lib/prisma_master';
import { omit } from 'radash';
export const createSubscription = async (subscriptionDetails: Partial<AccountSubscription>, tx = prisma) => {
  const newSubscription = await tx.accountSubscription.create({
    data: {
      ...omit(subscriptionDetails, ['AccSubId']),
    },
  });
  return newSubscription;
};
