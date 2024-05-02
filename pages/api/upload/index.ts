import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { bulkFileUpload, singleFileUpload } from 'services/uploadService';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, _fields, files) => {
      if (err) {
        res.status(500).json({ message: 'Error parsing the form data.' });
        return;
      }

      if (!files.file) {
        res.status(400).json({ message: 'File upload error: No file was uploaded.' });
        return;
      }

      const file = files.file;
      let response = {};
      const path = _fields.path;
      try {
        if (!Array.isArray(file)) {
          response = await singleFileUpload(path, file);
        } else {
          response = await bulkFileUpload(path, file);
        }
      } catch (error) {
        res.status(500).json({ error: 'File uploaded unsuccessful.', message: error.message });
      }

      res.status(200).json({ message: 'File uploaded successfully.', response });
    });
  } catch (error) {
    res.status(500).json({ error: 'File uploaded unsuccessful.', message: error.message });
  }
}
