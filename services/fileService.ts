import { getFileUrl } from '../lib/s3';
import prisma from '../lib/prisma';

// export interface UploadedFile {
//   id?: number;
//   size: number;
//   name: string;
//   error?: string;
//   file?: File;
//   imageUrl?: string;
// }
export const getFileCardFromFileId = async (Id: number) => {
  const result = await prisma.File.findFirst({
    where: { Id },
    select: { Location: true, MediaType: true, OriginalFilename: true },
  });
  console.log(result);
  return {
    id: Id,
    name: result.OriginalFilename,
    imageUrl: getFileUrl(result.Location.replaceAll(' ', '+')),
    MediaType: result.MediaType,
    fileLocation: result.Location,
  };
};
