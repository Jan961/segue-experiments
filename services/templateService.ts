import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';


export const fetchAllTemplates = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  const templates = await prisma.template.findMany({
    include: {
      File: true,
    },
  });

  return templates.map((template) => ({
    id: template.TemplateId ?? null,
    name: template.TemplateName ?? null,
    location: template.File.Location ?? null,
  }));
};
