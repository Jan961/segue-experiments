import { NextApiRequest, NextApiResponse } from 'next';
import { createAccountContact } from 'services/accountService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { accountId, firstName, lastName, email } = req.body;
    const accountContact = await createAccountContact({
      accountId,
      firstName,
      lastName,
      email,
    });

    return res.status(200).json(accountContact);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating a new account contact' });
  }
}
