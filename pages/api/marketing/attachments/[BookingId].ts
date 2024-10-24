import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string);
    const prisma = await getPrismaClient(req);

    const fileIds = await prisma.bookingFile.findMany({
      where: {
        BookingFileBookingId: BookingId,
      },
      select: { BookingFileFileId: true },
    });
    console.log('file ids', fileIds);

    const fileIdArray = fileIds.map((bookingFile) => bookingFile.BookingFileFileId);
    console.log('file id array', fileIdArray);
    const attachments = await prisma.file.findMany({
      where: {
        Id: { in: fileIdArray },
      },
      select: {
        OriginalFilename: true,
        FileCreatedDateTime: true,
        FileLastModifiedDateTime: true,
      },
      orderBy: {
        FileLastModifiedDateTime: 'desc',
      },
    });

    res.json(attachments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}
