import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { transformContractResponse } from 'transformers/contracts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Contract ID is required' });
  }

  try {
    const contractId = Number(id);
    const prisma = await getPrismaClient(req);
    const contract = await prisma.aCCContract.findUnique({
      where: { ContractId: contractId },
      include: {
        ACCClause: true,
        ACCPayment: true,
        ACCPubEvent: true,
        ACCDepartment: true,
        Person: true,
        Production: true,
        Venue: true,
      },
    });

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const transformedData = transformContractResponse(contract);

    return res.status(200).json(transformedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
