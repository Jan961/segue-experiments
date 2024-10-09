import { NextApiRequest, NextApiResponse } from 'next';
import { bulkFileUpload, singleFileUpload, transformForPrisma, transformForUi } from 'services/uploadService';
import { parseFormData } from 'utils/fileUpload';
import { getEmailFromReq, getUserId } from 'services/userService';
import getPrismaClient from 'lib/prisma';
import { FileDTO } from 'interfaces';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fields, files } = await parseFormData(req);
    const prisma = await getPrismaClient(req);
    const email = await getEmailFromReq(req);
    const userId = await getUserId(email);
    if (!files.file) {
      res.status(400).json({ message: 'File upload error: No file was uploaded.' });
      return;
    }

    const file = files.file;
    let fileRecords;
    const path = fields.path as string;

    if (!Array.isArray(file)) {
      const uploadedFile = await singleFileUpload(path, file, userId);
      fileRecords = await prisma.file.create({
        data: transformForPrisma(uploadedFile),
      });
    } else {
      const uploadedData: FileDTO[] = await bulkFileUpload(path, file, userId);
      await prisma.file.createMany({
        data: uploadedData.map((file) => transformForPrisma(file)),
      });
      const fileLocations = uploadedData.map((file) => file.location);
      fileRecords = await prisma.file.findMany({
        where: { Location: { in: fileLocations } },
      });
    }
    let uiResponse;
    if (Array.isArray(fileRecords)) {
      uiResponse = fileRecords?.map((record) => transformForUi(record));
    } else {
      uiResponse = transformForUi(fileRecords);
    }

    res.status(200).json(uiResponse);
  } catch (error) {
    console.log('Error uploading file: ', error);
    res.status(500).json({ error: 'File upload unsuccessful', message: error.message });
  }
}
