import { loggingService } from 'services/loggingService';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export type VenueAttachedFile = {
  FileId: number;
  FileVenueId: number;
  FileDescription: string;
  FileOriginalFilename: string;
  FileCategory: string;
  FileDateTime: Date;
  FileUploadedDateTime: Date;
  FileUrl: string;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as VenueAttachedFile;
    console.log(data);
    console.log(prisma);
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    // await prisma.VenueAttachedFile.create({
    //   data,
    // });
    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error creating VenueAttachedFile' });
  }
}
