import { NextApiRequest, NextApiResponse } from 'next';
import { createAccount, createAccountContact } from 'services/accountService';
import { createClientDB } from 'services/dbService';
import { sendEmail } from 'services/emailService';
import {
  mapAccountContactFromPrismaFields,
  mapAccountFromPrismaFields,
  mapToAccountContactPrismaFields,
  mapToAccountPrismaFields,
} from './utils';
import { NEW_ACCOUNT_CONFIRMATION_EMAIL_TEMPLATE } from 'config/global';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const account = req.body;
    const organisationId = (Math.random() + 1).toString(36).substring(5);
    const mappedAccount = mapToAccountPrismaFields({ ...account, organisationId });
    const newAccount = await createAccount(mappedAccount);
    const mappedAccountContact = mapToAccountContactPrismaFields({ ...account, accountId: newAccount.AccountId });
    const newAccountContact = await createAccountContact(mappedAccountContact);

    // Send an email to confirm new account
    await sendEmail(account.email, NEW_ACCOUNT_CONFIRMATION_EMAIL_TEMPLATE, {});

    // Create Database for the new account
    await createClientDB(newAccount.AccountOrganisationId);

    return res.status(200).json({
      ...mapAccountFromPrismaFields(newAccount),
      ...mapAccountContactFromPrismaFields(newAccountContact),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating new account' });
  }
}
