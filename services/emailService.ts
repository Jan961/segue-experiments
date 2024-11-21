import sgMail from '@sendgrid/mail';
import {
  NEW_ACCOUNT_SETUP_EMAIL,
  NEW_USER_PIN_EMAIL,
  NEW_USER_VERIFY_EMAIL,
  NEW_USER_WELCOME_EMAIL,
} from 'config/global';
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

export const sendVerificationEmail = async (to: string, magiclink = '') => {
  await sendEmail(to, NEW_USER_VERIFY_EMAIL, { magiclink });
};

export const sendAccountSetupEmail = async (emailAddress: string, companyName: string, signUpUrl: string) => {
  await sendEmail(emailAddress, NEW_ACCOUNT_SETUP_EMAIL, {
    companyname: companyName,
    emailaddress: emailAddress,
    weblink: signUpUrl,
  });
};

export const sendNewUserEmail = async (
  emailAddress: string,
  password: string,
  companyName: string,
  signInUrl: string,
) => {
  await sendEmail(emailAddress, NEW_USER_WELCOME_EMAIL, {
    companyname: companyName,
    emailaddress: emailAddress,
    password,
    weblink: signInUrl,
  });
};

export const sendUserPinEmail = async (emailAddress: string, pin: string) => {
  await sendEmail(emailAddress, NEW_USER_PIN_EMAIL, { AccountPin: pin });
};
