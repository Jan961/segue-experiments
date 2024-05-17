import config from 'config';
import formidable, { IncomingForm, Fields, Files } from 'formidable';
import { NextApiRequest } from 'next';

export async function parseFormData(req: NextApiRequest): Promise<{ fields: Fields; files: Files }> {
  return new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    const form: IncomingForm = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}

export const getFileUrlFromLocation = (location: string) => {
  return `${config.cloudFrontDomain}/${location}`;
};
