import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { contractSchemaUpdate } from 'validators/contracts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const validatedData = await contractSchemaUpdate.validate(req.body, { abortEarly: false });
    const { contractId, contractData } = validatedData;
    console.log(contractData);

    await prisma.$transaction(async (tx) => {
      await Promise.all(
        contractData.map(async (row) => {
          await tx.ACCContractData.upsert({
            where: {
              DataACCContractId_DataComponentId_DataIndexNum: {
                DataACCContractId: contractId,
                DataComponentId: row.compID,
                DataIndexNum: row.index,
              },
            },
            update: {
              DataValue: row.value,
            },
            create: {
              ACCContract: {
                connect: {
                  ContractId: contractId,
                },
              },
              TemplateComponent: {
                connect: {
                  ComponentId: row.compID,
                },
              },
              DataIndexNum: row.index,
              DataValue: row.value,
            },
          }).catch((err) => {
            throw new Error(err);
          });
        }),
      );
    });

    res.status(200).json({ message: 'Success' });
  } catch (err) {
    console.error(err, 'Error - failed to update contract');
  }
}
