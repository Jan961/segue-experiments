import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

const formatCompanyDetails = (company: any) => {
  return {
    id: company.ProdCoId,
    companyName: company.ProdCoName,
    companyVATNo: company.ProdCoVATCode || '',
    fileName: company.File?.FileOriginalFilename || '',
    fileLocation: company.File?.FileLocation || '',
    fileId: company.File?.FileId,
    webSite: company.ProdCoWebSite,
    hasProductions: company.Production?.length > 0,
  };
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const productionCompanyList = await prisma.ProductionCompany.findMany({
      where: {
        ProdCoAccountId: AccountId,
      },
      include: {
        File: true,
      },
      orderBy: [
        {
          ProdCoId: 'desc',
        },
      ],
    });
    const formattedList = productionCompanyList?.map(formatCompanyDetails) || [];
    return res.status(200).json(formattedList);
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: 'An error occurred while retrieving your Production Companies. Please try again.' });
  }
}
