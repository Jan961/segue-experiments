import client from 'lib/prisma';
import master from 'lib/prisma_master';

export const getRoles = async () => {
  return client.venueRole.findMany();
};

export const getAccountContacts = async (accountId: number) => {
  return master.AccountContact.findMany({
    where: {
      AccContAccountId: accountId,
    },
  });
};
