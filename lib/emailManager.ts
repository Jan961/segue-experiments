import sgMail, { MailDataRequired } from '@sendgrid/mail';

sgMail.setApiKey(process.env.NEXT_PUBLIC_SENDGRID_API_KEY);

const EMAIL_TEMPLATES = {
  NEW_ACCOUNT_CONFIRMATION: 'd-a0eb6675e5954260a6c107638a39b04e',
};

export type EmailMessageProps = {
  to: string;
  templateName: string;
  dynamicTemplateData: MailDataRequired;
};

export const sendEmail = async ({ to, dynamicTemplateData }: EmailMessageProps) => {
  try {
    const params: MailDataRequired = {
      to,
      from: {
        email: 'donotreply@segue.com',
        name: 'Segue Team',
      },
      templateId: EMAIL_TEMPLATES.NEW_ACCOUNT_CONFIRMATION,
      dynamicTemplateData,
    };
    await sgMail.send(params);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send email');
  }
};
