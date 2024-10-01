import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body;
    const prisma = await getPrismaClient(req);
    const result = await prisma.venueFile.create({
      data: { ...data, Type: 'Tech Specs' },
    });
    res.status(200).json(result);
  } catch (exception) {
    console.log(exception);
    res.status(400).json('Failed to upload file.');
  }
}
