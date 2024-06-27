import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const { Name, WebSite } = JSON.parse(req.body.body);
    const newProdCompany = await prisma.ProductionCompany.create({
      data: {
        AccountId,
        WebSite,
        Name,
      },
    });

    res.status(200).json(newProdCompany);
  } catch (exception) {
    res
      .status(500)
      .json({ errorMessage: 'An error occurred while creating your Production Company. Please try again.' });
  }
}
