import { NextApiRequest, NextApiResponse } from 'next';
import { createAccount } from 'services/accountService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, companyName, currency, addressLine1, addressLine2, addressLine3, town, county, postcode, country } =
      req.body;
    const account = createAccount({
      email,
      companyName,
      currency,
      addressLine1,
      addressLine2,
      addressLine3,
      town,
      county,
      postcode,
      country,
    });

    return res.status(200).json(account);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating new account' });
  }
}
