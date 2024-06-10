import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { EmailTemplate } from '@prisma/client';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await prisma.emailTemplate.findMany();
    const formattedValues: EmailTemplate[] = result.map(
      ({ EmTemId, EmTemName, EmTemDescription, EmTemFields, EmTemFrom }) => ({
        templateId: EmTemId,
        templateName: EmTemName,
        templateDescription: EmTemDescription,
        templateFields: EmTemFields,
        emailFrom: EmTemFrom,
      }),
    );
    res.status(200).json(formattedValues);
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error fetching email templates' });
  }
}
