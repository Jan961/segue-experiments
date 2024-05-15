import { NextApiRequest, NextApiResponse } from 'next';
import { bulkFileUpload, singleFileUpload, transformForPrisma } from 'services/uploadService';
import { parseFormData } from 'utils/fileUpload';
import { getEmailFromReq, getUserId } from 'services/userService';
import prisma from 'lib/prisma';
import { FileDTO } from 'interfaces';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fields, files } = await parseFormData(req);
    const email = await getEmailFromReq(req);
    const userId = await getUserId(email);
    if (!files.file) {
      res.status(400).json({ message: 'File upload error: No file was uploaded.' });
      return;
    }

    const file = files.file;
    let response: FileDTO[] | FileDTO;
    const path = fields.path as string;

    if (!Array.isArray(file)) {
      response = await singleFileUpload(path, file, userId);
    } else {
      response = await bulkFileUpload(path, file, userId);
    }

    const fileRecords = transformForPrisma(response);

    await prisma.file.createMany({
      data: fileRecords,
    });

    res.status(200).json(response);
  } catch (error) {
    console.log('Error uploading file: ', error);
    res.status(500).json({ error: 'File upload unsuccessful', message: error.message });
  }
}
