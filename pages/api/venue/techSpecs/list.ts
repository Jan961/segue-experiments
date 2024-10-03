import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

import { getFileUrl } from 'lib/s3';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { VenueId } = req.body;
    const prisma = await getPrismaClient(req);

    const venueFiles = (
      await prisma.venueFile.findMany({
        where: { VenueId, Type: 'Tech Specs' },
        select: { FileId: true },
      })
    ).map((file) => file.FileId);
    const fileInfo = await prisma.file.findMany({
      where: { Id: { in: venueFiles } },
      select: { OriginalFilename: true, MediaType: true, Location: true, UploadDateTime: true, Id: true },
    });

    const uploadedFileArr = await Promise.all(
      fileInfo.map(async (file) => {
        const imageUrl = await getFileUrl(file.Location);
        return {
          size: -1,
          name: file.OriginalFilename,
          imageUrl,
          location: file.Location,
          fileId: file.Id,
          uploadDateTime: file.UploadDateTime,
        };
      }),
    );

    res.status(200).json(uploadedFileArr);
  } catch (exception) {
    console.log(exception);
    res.status(400).json('Failed to get files.');
  }
}
