import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: 'Contract ID is required to retrieve template form structure' });
  }

  try {
    const contractID = Number(id);

    const contract = await prisma.ACCContract.findUnique({
      where: { ContractId: contractID },
      include: {
        TemplateID: true,
      },
    });

    if (!contract) {
      return res.status(404).json({ message: 'Contract with ID ' + contractID + ' not found' });
    }

    const TemplateID = contract.TemplateID;

    const formComponents = await prisma.TemplateStructure.findMany({
      where: { TemplateID },
      include: {
        types: {
          select: {
            TypeName: true,
          },
        },
      },
    });

    return res.status(200).json(formComponents);
  } catch (err) {
    console.error(err, 'Error - Failed to retrieve Template Form Components');
    return res.status(500).json(err);
  }
}
