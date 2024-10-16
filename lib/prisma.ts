import { NextApiRequest } from 'next';
import { PrismaClient } from 'prisma/generated/prisma-client';
import { getOrganisationIdFromReq } from 'services/userService';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 3600 });

const getPrismaClient = async (req: NextApiRequest): Promise<PrismaClient> => {
  if (req) {
    try {
      const clientDBUrl = process.env.CLIENT_DATABASE_URL;
      const orgId = (await getOrganisationIdFromReq(req)) as string;
      if (!orgId) {
        throw new Error('Unable to get orgId');
      }

      const prismaUrl = `${clientDBUrl}_${process.env.DEPLOYMENT_ENV}_Segue_${orgId}`;

      // get prisma client from cache
      const cachedClient = cache.get(orgId);

      if (cachedClient) {
        return cachedClient as PrismaClient;
      }

      // create new prisma client and add it to cache
      const client = new PrismaClient({ datasourceUrl: prismaUrl });
      cache.set(orgId, client);
      return client;
    } catch (e) {
      console.log('Error getting prisma client', e);
    }
  }
  throw new Error('In getPrismaClient, req is null');
};

export default getPrismaClient;
