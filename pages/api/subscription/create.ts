import { AccountSubscription } from 'prisma/generated/prisma-master';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSubscription } from 'services/subscriptionService';

export const mapToAccountSubscriptionPrismaFields = (subscriptionDetails: any): AccountSubscription => {
  return {
    AccSubId: subscriptionDetails.id || null,
    AccSubAccountId: subscriptionDetails.accountId,
    AccSubPlanId: subscriptionDetails.planId,
    AccSubStartDate: subscriptionDetails.startDate,
    AccSubEndDate: subscriptionDetails.endDate,
    AccSubIsActive: subscriptionDetails.isActive,
  };
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const subscriptionDetails = req.body;
    const newSubscription = await createSubscription(mapToAccountSubscriptionPrismaFields(subscriptionDetails));
    return res.status(200).json(newSubscription);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating new subscription' });
  }
}
