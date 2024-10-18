import { NextApiRequest } from 'next';
import { PrismaClient } from 'prisma/generated/prisma-client';
import { getOrganisationIdFromReq } from 'services/userService';

declare const globalThis: {
  prismaGlobal: PrismaClient;
} & typeof global;

const prismaClientSingleton = async (req: NextApiRequest) => {
  try {
    console.log('Creating new prisma client');
    const clientDBUrl = process.env.CLIENT_DATABASE_URL;
    const orgId = (await getOrganisationIdFromReq(req)) as string;
    if (!orgId) {
      throw new Error('Unable to get orgId');
    }

    const prismaUrl = `${clientDBUrl}_${process.env.DEPLOYMENT_ENV}_Segue_${orgId}`;
    const client = new PrismaClient({ log: ['info'], datasourceUrl: prismaUrl });
    if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = client;
    return client;
  } catch (e) {
    console.log('Error creating prisma client', e);
  }
};

const getPrismaClient = async (req: NextApiRequest): Promise<PrismaClient> => {
  console.log('In getPrismaClient', !!globalThis.prismaGlobal);
  if (req) {
    return globalThis.prismaGlobal ?? prismaClientSingleton(req);
  } else {
    throw new Error('In getPrismaClient, req is null');
  }
};

export default getPrismaClient;
