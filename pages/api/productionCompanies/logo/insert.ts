import { NextApiRequest, NextApiResponse } from 'next';
import { parseFormData } from 'utils/fileUpload';
import { getAccountId, getEmailFromReq } from 'services/userService';
import prisma from 'lib/prisma_master';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { fields, files } = await parseFormData(req);
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const Id = parseInt(fields.Id);

    if (!files.file) {
      res.status(500).json({ message: 'File upload error: No file was uploaded.' });
      return;
    }

    const file = files.file;

    if (!Array.isArray(file)) {
      const buffer = await fs.promises.readFile(file.filepath);
      const base64String = buffer.toString('base64');

      await prisma.productionCompany.update({
        data: { Logo: base64String },
        where: {
          Id,
          AccountId,
        },
      });
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.log('Error uploading file: ', error);
    res.status(500).json({ error: 'File upload unsuccessful', message: error.message });
  }
}
