import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { updateContractSchema } from 'validators/contracts';
import { prepareContractUpdateData } from 'services/contracts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: 'Contract ID is required' });
  }
  try {
    const validatedData = await updateContractSchema.validate(req.body, { abortEarly: false });
    const contractData = prepareContractUpdateData({
      ...validatedData,
      accScheduleJson: JSON.stringify(validatedData.accScheduleJson),
    });
    const prisma = await getPrismaClient(req);
    const response = await prisma.aCCContract.update({
      where: {
        ContractId: Number(id),
      },
      data: {
        ...contractData,
      },
    });
    res.status(200).json({ ok: true, response });
  } catch (err) {
    console.error(err, 'Error - failed to update contract');
    res.status(500).json(err);
  }
}
