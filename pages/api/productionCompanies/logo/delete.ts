import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const { Id } = JSON.parse(req.body);

    const edited = await prisma.productionCompany.update({
      data: {
        Logo: null,
      },
      where: {
        Id,
        AccountId,
      },
    });
    res.status(200).json(edited);
  } catch (exception) {
    res
      .status(500)
      .json({ errorMessage: 'An error occurred whilst updating your Production Company details. Please try again.' });
  }
}
