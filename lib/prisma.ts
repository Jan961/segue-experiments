import { PrismaClient } from 'prisma/generated/prisma-client';
import { getOrganisationIdFromReq } from 'services/userService';

const getPrismaClient = async (req): Promise<PrismaClient> => {
  if (req) {
    try {
      const clientDBUrl = process.env.CLIENT_DATABASE_URL;
      const orgId = await getOrganisationIdFromReq(req);
      const prismaUrl = `${clientDBUrl}_${process.env.DEPLOYMENT_ENV}_Segue_${orgId}`;
      const client = new PrismaClient({ datasourceUrl: prismaUrl });

      return client;
    } catch (e) {
      console.log('Error getting prisma client', e);
    }
  }
  console.log('In getPrismaClient, req is null');
  return null;
};

export default getPrismaClient;
