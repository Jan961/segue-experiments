import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: 'Template ID is required to retrieve template form structure' });
  }

  try {
    const prisma = await getPrismaClient(req);
    const templateID = Number(id);

    const result = await prisma.templateRow.findMany({
      where: {
        TemplateRowTemplateId: templateID,
      },
      include: {
        TemplateComponent: {
          include: {
            TemplateEntryType: {
              select: {
                TETypeName: true,
              },
            },
          },
        },
      },
    });

    const templatestructure = result.map((row) => ({
      rowID: row.TemplateRowId,
      rowNum: row.TemplateRowNum,
      rowLabel: row.TemplateRowLabel,
      isAList: row.TemplateRowIsAList,
      listName: row.TemplateRowListName,
      components: row.TemplateComponent.map((component) => ({
        id: component.ComponentId,
        label: component.ComponentLabel,
        orderInRow: component.ComponentSeqNo,
        tag: component.ComponentTag,
        type: component.TemplateEntryType.TETypeName,
      })),
    }));

    return res.status(200).json(templatestructure);
  } catch (err) {
    console.error(err, 'Error - Failed to retrieve Template Form Components');
    return res.status(500).json(err);
  }
}
