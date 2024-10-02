import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';
import { contractSchemaUpdate } from 'validators/contracts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const validatedData = await contractSchemaUpdate.validate(req.body, { abortEarly: false });
    const { contractId, contractData } = validatedData;
    const prisma = await getPrismaClient(req);

    await prisma.$transaction(async (tx) => {
      await tx.aCCContractData.deleteMany({
        where: {
          DataACCContractId: contractId,
        },
      });

      await Promise.all(
        contractData.map((row) =>
          tx.aCCContractData
            .create({
              data: {
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
                DataValue: JSON.stringify(row.value),
              },
            })
            .catch((err) => {
              throw new Error(err);
            }),
        ),
      );
    });

    res.status(200).json({ message: 'Success' });
  } catch (err) {
    console.error(err, 'Error - failed to update contract');
    res.status(500).json(err);
  }
}
