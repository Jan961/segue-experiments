import { AccountSubscription } from 'prisma/generated/prisma-master';
import getPrismaClient from 'lib/prisma';
import { omit } from 'radash';
export const createSubscription = async (subscriptionDetails: Partial<AccountSubscription>, tx = prisma) => {
  const newSubscription = await tx.accountSubscription.create({
    data: {
      ...omit(subscriptionDetails, ['AccSubId']),
    },
  });
  return newSubscription;
};
