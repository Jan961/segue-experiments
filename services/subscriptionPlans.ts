import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';
export default async function getAllPlans(req: NextApiRequest) {
  try {
    const prisma = getPrismaClient(req);
    const response = await prisma.subscriptionPlan.findMany();
    return response;
  } catch (err) {
    console.log('Error fetching plans', err);
    return [];
  }
}
