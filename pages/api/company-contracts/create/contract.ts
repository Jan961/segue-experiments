import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { CompanyContractStatus } from 'config/contracts';
import { contractSchemaCreate } from 'validators/contracts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const prisma = await getPrismaClient(req);

  try {
    const validatedData = await contractSchemaCreate.validate(req.body, { abortEarly: false });

    const { production, department, role, personId, contractData, accScheduleJson = [], templateId } = validatedData;

    const result = await prisma.$transaction(async (tx) => {
      const result = await tx.aCCContract.create({
        data: {
          RoleName: role,
          ContractStatus: CompanyContractStatus.NotYetIssued,
          ACCScheduleJSON: JSON.stringify(accScheduleJson),
          DateIssued: new Date(),
          ACCDepartment: {
            connect: { ACCDeptId: department },
          },
          Person: {
            connect: { PersonId: personId },
          },
          Production: {
            connect: { Id: production },
          },
          Template: {
            connect: { TemplateId: templateId },
          },
        },
      });

      const contractID = result.ContractId;

      const contractDataPromises = contractData.map((contractDatum) =>
        tx.aCCContractData.create({
          data: {
            ACCContract: {
              connect: {
                ContractId: contractID,
              },
            },
            TemplateComponent: {
              connect: {
                ComponentId: contractDatum.compID,
              },
            },
            DataIndexNum: contractDatum.index,
            DataValue: JSON.stringify(contractDatum.value),
          },
        }),
      );

      await Promise.all(contractDataPromises);

      return 'Success';
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err, 'Error - failed to create contract');
    res.status(500).json(err);
  }
}
