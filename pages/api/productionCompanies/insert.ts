import master from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const { companyName, webSite, companyVATNo } = req.body;
    const newProdCompany = await master.ProductionCompany.create({
      data: {
        ProdCoAccountId: AccountId,
        ProdCoName: companyName,
        ProdCoVATCode: companyVATNo,
        ProdCoWebSite: webSite,
      },
    });

    res.status(200).json(newProdCompany);
  } catch (error) {
    res
      .status(500)
      .json({ errorMessage: 'An error occurred while creating your Production Company. Please try again.' });
  }
}
