import { getFileUrl } from 'lib/s3';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';

export const getFileCardFromFileId = async (Id: number, req: NextApiRequest) => {
  try {
    const prisma = await getPrismaClient(req);
    const result = await prisma.file.findFirst({
      where: { Id },
      select: { Location: true, MediaType: true, OriginalFilename: true },
    });
    return {
      id: Id,
      name: result.OriginalFilename,
      imageUrl: getFileUrl(result.Location.replaceAll(' ', '+')),
      MediaType: result.MediaType,
      fileLocation: result.Location,
    };
  } catch (exception) {
    return null;
  }
};
