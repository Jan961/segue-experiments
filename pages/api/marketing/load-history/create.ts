import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fileId, selected } = req.body;

    await prisma.ProductionFile.create({
      data: {
        ProFiFileId: fileId,
        ProFiProductionId: selected,
        ProFiFileType: '...',
        ProFiFileDescription: '...',
      },
    });

    res.status(200).json({ status: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error Creating Production File' });
  }
}
