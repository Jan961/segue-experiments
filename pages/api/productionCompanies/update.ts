import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { companyName, webSite, id, companyVATNo, fileId } = req.body;

    const updated = await prisma.productionCompany.update({
      data: {
        WebSite: webSite,
        Name: companyName,
        ProdCoVATCode: companyVATNo,
        ...(fileId && {
          File: {
            connect: {
              Id: fileId,
            },
          },
        }),
      },
      where: {
        Id: id,
      },
      include: { File: true },
    });
    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errorMessage: 'An error occurred whilst updating your Production Company details. Please try again.' });
  }
}
