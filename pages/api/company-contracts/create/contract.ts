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

    const { production, department, role, personId, contractData, accScheduleJson = [], templateId } = validatedData;
    console.log(production);
    console.log(department);
    console.log(role);
    console.log(personId);
    console.log(contractData);
    console.log(templateId);

    const result = await prisma.$transaction(async (tx) => {
      const result = await tx.ACCContract.create({
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

      for (const contractDatum of contractData) {
        await tx.ACCContractData.create({
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
            DataValue: contractDatum.value,
          },
        });
      }

      return 'Success';
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err, 'Error - failed to create contract');
  }
}
