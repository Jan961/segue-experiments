import getPrismaClient from 'lib/prisma';
import master from 'lib/prisma_master';
import { NextApiRequest } from 'next';

export const getRoles = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.venueRole.findMany();
};

export const getAccountContacts = async (accountId: number) => {
  return master.AccountContact.findMany({
    where: {
      AccContAccountId: accountId,
    },
  });
};
