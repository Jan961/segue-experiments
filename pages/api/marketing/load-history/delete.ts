import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fileId } = req.body;

    await prisma.ProductionFile.delete({
      where: { ProFiFileId: { equals: fileId } },
    });

    res.status(200).json({ status: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error Deleting Production File' });
  }
}
