import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to convert the file to PDF' });
      }

      // const file = files.path;
    });
  } catch (error) {}
}
