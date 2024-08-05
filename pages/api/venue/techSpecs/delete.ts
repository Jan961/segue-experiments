import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { isNullOrEmpty } from 'utils';
import { deleteFile } from '../../../../services/uploadService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fileId } = req.body;
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    const fileObj = await prisma.File.delete({
      where: { Id: fileId },
    });

    await deleteFile(fileObj.Location);
    const venueFileObj = await prisma.VenueFile.findFirst({
      where: { FileId: fileId, Type: 'Tech Specs' },
      select: { Id: true },
    });
    if (!isNullOrEmpty(venueFileObj)) {
      await prisma.VenueFile.delete({
        where: { FileId: fileId, Id: venueFileObj.Id },
      });

      res.status(200).json();
    } else {
      res.status(400).json('File was already deleted.');
    }
  } catch (exception) {
    console.log(exception);
    res.status(400).json('Failed to delete file.');
  }
}
