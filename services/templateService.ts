import prisma from 'lib/prisma';

export const fetchAllTemplates = async () => {
  const templates = await prisma.Template.findMany({
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
