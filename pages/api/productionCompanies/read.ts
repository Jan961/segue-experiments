import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';
import byteArrToBaseString from '../../../utils/byteArrToBaseString';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const productionCompanyList = await prisma.ProductionCompany.findMany({
      where: {
        AccountId,
      },
      select: {
        Id: true,
        Name: true,
        WebSite: true,
        Logo: true,
      },
      orderBy: [
        {
          Name: 'asc',
        },
      ],
    });
    return res.status(200).json(
      productionCompanyList.map((item) => {
        item.Logo = byteArrToBaseString(item.Logo);
        return item;
      }),
    );
  } catch (err) {
    res
      .status(409)
      .json({ errorMessage: 'An error occurred while retrieving your Production Companies. Please try again.' });
  }
}
