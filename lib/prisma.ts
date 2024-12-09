import { NextApiRequest } from 'next';
import { PrismaClient } from 'prisma/generated/prisma-client';
import { getOrganisationIdFromReq } from 'services/userService';

declare const globalThis: {
  clients: Record<string, PrismaClient>;
} & typeof global;

if (!globalThis.clients) {
  console.log('Creating globalThis.clients');
  globalThis.clients = {};
}

export const createPrismaClient = (orgId: string) => {
  console.log('Creating prisma client for', orgId);
  try {
    const clientDBUrl = process.env.CLIENT_DATABASE_URL;
    const prismaUrl = `${clientDBUrl}_${process.env.DEPLOYMENT_ENV}_Segue_${orgId}?connection_limit=3&pool_timeout=20`;
    const client = new PrismaClient({ datasourceUrl: prismaUrl });
    globalThis.clients[orgId] = client;
    return client;
  } catch (e) {
    console.log('Error creating prisma client', e);
  }
};

const getPrismaClient = async (req: NextApiRequest): Promise<PrismaClient> => {
  if (req) {
    const orgId = (await getOrganisationIdFromReq(req)) as string;

    if (!orgId) {
      throw new Error('Unable to get orgId');
    }
    return globalThis.clients?.[orgId] ?? createPrismaClient(orgId);
  } else {
    throw new Error('In getPrismaClient, req is null');
  }
};

export default getPrismaClient;
