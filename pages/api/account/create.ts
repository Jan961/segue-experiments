import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { createAccount, createAccountContact } from 'services/accountService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { firstName, lastName, email, companyName, currency } = req.body;
    const accountWithContact = await prisma.$transaction(async (tx) => {
      const account = await createAccount(tx, {
        email,
        companyName,
        currency,
      });
      console.log(account);
      const accountContact = await createAccountContact(tx, {
        accountId: account.AccountId,
        firstName,
        lastName,
        email,
      });
      return accountContact;
    });
    return res.status(200).json(accountWithContact);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating new account' });
  }
}
