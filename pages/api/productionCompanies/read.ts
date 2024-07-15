import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

const formatCompanyDetails = (company: any) => {
  return {
    id: company.Id,
    companyName: company.Name,
    companyVATNo: company.ProdCoVATCode || '',
    fileName: company.File?.OriginalFilename || '',
    fileLocation: company.File?.Location || '',
    fileId: company.File?.Id,
    webSite: company.WebSite,
    hasProductions: company.Production?.length > 0,
  };
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const productionCompanyList = await prisma.ProductionCompany.findMany({
      where: {
        AccountId,
      },
      include: {
        File: true,
        Production: true,
      },
      orderBy: [
        {
          Id: 'desc',
        },
      ],
    });

    return res.status(200).json(productionCompanyList.map(formatCompanyDetails));
  } catch (err) {
    res
      .status(500)
      .json({ errorMessage: 'An error occurred while retrieving your Production Companies. Please try again.' });
  }
}
