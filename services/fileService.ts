import { getFileUrl } from 'lib/s3';
import prisma from 'lib/prisma';

export const getFileCardFromFileId = async (Id: number) => {
  try {
    const result = await prisma.File.findFirst({
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
