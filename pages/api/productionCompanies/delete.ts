import master from 'lib/prisma_master';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const { id } = req.query;

    const prisma = await getPrismaClient(req);
    const productionCount = await prisma.production.count({ where: { ProdCoId: Number(id) } });

    if (productionCount === 0) {
      const numProdCompanies = await master.productionCompany.count({
        where: { ProdCoAccountId: AccountId },
      });

      if (numProdCompanies > 1) {
        const deletedRecord = await master.ProductionCompany.delete({
          where: {
            ProdCoId: Number(id),
            ProdCoAccountId: AccountId,
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
        errorMessage:
          'Deletion is not permitted as this Production Company is associated with one or more productions.',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errorMessage: 'An error occurred whilst deleting your Production Company. Please try again.',
    });
  }
}
