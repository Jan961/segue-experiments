import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { CompanyContractStatus } from 'config/contracts';
import { contractSchema } from 'validators/contracts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const validatedData = await contractSchema.validate(req.body, { abortEarly: false });

    const { production, department, role, personId, contractData, accScheduleJson = [] } = validatedData;

    await prisma.ACCContract.create({
      data: {
        PersonId: personId,
        RoleName: role,
        ContractStatus: CompanyContractStatus.NotYetIssued,
        ProductionID: production,
        ACCCDeptId: department,
        ACCScheduleJSON: accScheduleJson,
      },
    });

    await prisma.ACCContractData.createMany({
      data: contractData,
    });
  } catch (err) {
    console.error(err, 'Error - failed to create contract');
  }
}
