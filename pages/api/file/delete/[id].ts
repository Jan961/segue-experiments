import { File } from '@prisma/client';
import prisma from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteFile } from 'services/uploadService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid request' });
  }
  try {
    const file: File = await prisma.File.findUnique({
      where: { Id: Number(id) },
    });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    await deleteFile(file.Location);
    const deletedFile = await prisma.File.delete({
      where: { Id: Number(id) },
    });
    res.status(200).json(deletedFile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the file' });
  }
}
