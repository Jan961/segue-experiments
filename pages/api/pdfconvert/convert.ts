import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to convert the file to PDF' });
      }

      const file = files.path;
      const convertFormData = new FormData();
      convertFormData.append('file', file);
      convertFormData.append('token', '123');
    });
  } catch (error) {}
}
