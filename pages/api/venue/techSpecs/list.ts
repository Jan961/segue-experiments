import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { UploadedFile } from 'components/core-ui-lib/UploadModal/interface';
import { getFileUrl } from 'lib/s3';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { VenueId } = req.body;
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, {});
    if (!access) return res.status(401).end();

    const venueFiles = await prisma.VenueFile.findMany({
      where: { VenueId, Type: 'Tech Specs' },
      select: { FileId: true },
    });
    const fileInfo = await prisma.File.findMany({
      where: { Id: { in: venueFiles } },
      select: { OriginalFileName: true, MediaType: true, Location: true, UploadDateTime: true, Id: true },
    });

    const uploadedFileArr: UploadedFile[] = await fileInfo.map(async (file) => {
      const imageUrl = getFileUrl(file.Location);
      return { size: -1, name: file.OriginalFileName, imageUrl, location: file.Location, fileId: file.Id };
    });

    res.status(200).json(uploadedFileArr);
  } catch (exception) {
    console.log(exception);
    res.status(400).json('Failed to upload file.');
  }
}
