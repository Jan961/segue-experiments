import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const { Id } = req.body;

    const prodCompanyWithShows = await prisma.Show.count({
      where: { ShowProdCoId: Id },
    });
    if (prodCompanyWithShows === 0) {
      const numProdCompanies = await prisma.ProductionCompany.count({
        where: { AccountId },
      });
      if (numProdCompanies > 1) {
        const deletedRecord = await prisma.ProductionCompany.delete({
          where: {
            Id,
            AccountId,
          },
        });

        res.status(200).json(deletedRecord);
      } else {
        res.status(500).json({
          errorMessage: 'Deletion is not permitted as this list must have at least one entry.',
        });
      }
    } else {
      res.status(500).json({
        errorMessage: 'Deletion is not permitted as this Production Company is responsible for one or more Shows',
      });
    }
  } catch (exception) {
    res.status(500).json({
      errorMessage: 'An error occurred whilst deleting your Production Company. Please try again.',
    });
  }
}
