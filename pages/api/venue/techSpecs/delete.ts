import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

import { isNullOrEmpty } from 'utils';
import { deleteFile } from 'services/uploadService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fileId } = req.body;
    const prisma = await getPrismaClient(req);

    const fileObj = await prisma.file.delete({
      where: { Id: fileId },
    });

    await deleteFile(fileObj.Location);
    const venueFileObj = await prisma.venueFile.findFirst({
      where: { FileId: fileId, Type: 'Tech Specs' },
      select: { Id: true },
    });
    if (!isNullOrEmpty(venueFileObj)) {
      await prisma.venueFile.delete({
        where: { FileId: fileId, Id: venueFileObj.Id },
      });

      res.status(200).json(venueFileObj);
    } else {
      res.status(400).json('File was already deleted.');
    }
  } catch (exception) {
    console.log(exception);
    res.status(400).json('Failed to delete file.');
  }
}
