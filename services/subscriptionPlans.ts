import getPrismaClient from 'lib/prisma';
export default async function getAllPlans() {
  try {
    const response = await prisma.subscriptionPlan.findMany();
    return response;
  } catch (err) {
    console.log('Error fetching plans', err);
    return [];
  }
}
