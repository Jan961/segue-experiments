import { NextApiRequest } from 'next';
import { PrismaClient } from 'prisma/generated/prisma-client';
import { getOrganisationIdFromReq } from 'services/userService';

const getPrismaClient = async (req: NextApiRequest): Promise<PrismaClient> => {
  if (req) {
    try {
      const clientDBUrl = process.env.CLIENT_DATABASE_URL;
      const orgId = await getOrganisationIdFromReq(req);
      if (!orgId) {
        throw new Error('Unable to get orgId');
      }
      console.log('orgId: ', orgId, clientDBUrl);
      const prismaUrl = `${clientDBUrl}_${process.env.DEPLOYMENT_ENV}_Segue_${orgId}`;
      const client = new PrismaClient({ datasourceUrl: prismaUrl });
      return client;
    } catch (e) {
      console.log('Error getting prisma client', e);
    }
  }
  throw new Error('In getPrismaClient, req is null');
};

export default getPrismaClient;
