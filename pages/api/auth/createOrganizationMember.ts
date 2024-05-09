import { NextApiRequest, NextApiResponse } from 'next';
import { clerkClient } from '@clerk/nextjs';
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, organizationId } = req.body;
    console.log(clerkClient, userId, organizationId);
    const response = await clerkClient.organizations.createOrganizationMembership({
      organizationId,
      userId,
      role: 'admin',
    });
    console.log('response', response);
    res.status(200).json({ status: 'success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating organization membership.' });
  }
}
