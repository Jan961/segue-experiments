import master from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { companyName, id, webSite, companyVATNo, fileId } = req.body;

    const updated = await master.productionCompany.update({
      data: {
        ProdCoName: companyName,
        ProdCoVATCode: companyVATNo,
        ProdCoWebSite: webSite,
        ...(fileId && {
          ProdCoLogoFileId: {
            connect: {
              FileId: fileId,
            },
          },
        }),
      },
      where: {
        ProdCoId: id,
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
