import sgMail from '@sendgrid/mail';
import prisma from 'lib/prisma_master';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to: string, templateName: string, data: any) => {
  // Get template id from DB
  const template = await prisma.emailTemplate.findFirst({
    where: {
      EmTemName: templateName,
    },
  });

  if (!template) {
    throw new Error(`Email template not found for ${templateName}`);
  }

  const msg = {
    to,
    from: template.EmTemFrom,
    templateId: template.EmTemId,
    dynamicTemplateData: data || {},
  };

  await sgMail.send(msg);
};
