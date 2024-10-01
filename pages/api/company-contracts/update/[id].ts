import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { prepareContractUpdateData } from 'services/contracts';
import { updateContractSchema } from 'validators/contracts';
import * as yup from 'yup';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Contract ID is required' });
  }

  try {
    const prisma = await getPrismaClient(req);
    const validatedData = await updateContractSchema.validate(req.body, { abortEarly: false });

    const updateData = prepareContractUpdateData({
      ...validatedData,
      accScheduleJson: JSON.stringify(validatedData.accScheduleJson),
    });
    // console.log(updateData.);
    const updatedContract = await prisma.aCCContract.update({
      where: { ContractId: Number(id) },
      data: updateData,
    });

    res.status(200).json({ message: 'Contract updated successfully', updatedContract });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }

    console.error(error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
