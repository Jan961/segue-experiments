import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: 'Contract ID is required to retrieve data' });
  }

  try {
    const contractID = Number(id);

    const data = await prisma.ACCContractData.findMany({
      where: { DataACCContractId: contractID },
    });

    return res.status(200).json(data);
  } catch (err) {
    console.error(err, 'Error - Failed to retrieve Template Form Components');
    return res.status(500).json(err);
  }
}
