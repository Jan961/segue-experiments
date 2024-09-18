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

    const mappedData = data.map((item) => ({
      compID: item.DataComponentId,
      index: item.DataIndexNum,
      value: item.Value,
    }));

    return res.status(200).json(mappedData);
  } catch (err) {
    console.error(err, 'Error - Failed to retrieve Template Form Components');
    return res.status(500).json(err);
  }
}
