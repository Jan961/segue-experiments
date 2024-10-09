import { File } from 'prisma/generated/prisma-client';
import getPrismaClient from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteFile } from 'services/uploadService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const prisma = await getPrismaClient(req);
  const { location: Location } = req.query;

  if (!Location || Array.isArray(Location)) {
    return res.status(400).json({ message: 'Invalid request' });
  }
  try {
    const files: File[] = await prisma.file.findMany({
      where: { Location },
    });
    if (files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    await deleteFile(files[0].Location);
    const deletedFile = await prisma.file.delete({
      where: { Id: files[0].Id },
    });
    res.status(200).json(deletedFile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete the file' });
  }
}
