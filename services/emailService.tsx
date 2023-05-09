import { Subject } from "rxjs";
import { filter } from "rxjs/operators";
import AccountRegistration from "../components/emails/accountRegistration";
import { User } from "../interfaces";
import fs from "fs";

const nodemailer = require("nodemailer");

export const emailService = {
  send,
  sendInvite,
  deleteUser,
  sendForgottenPassword,
};

async function getLogoBase64(logoPath) {
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");
  return logoBase64;
}

async function getSocialLogoBase64(socialLogoPath) {
  const socialLogoBase64 = await getLogoBase64(socialLogoPath);
  return socialLogoBase64;
}

async function createAttachmentsAndLogos() {
  const path = (await import("path")).default;
  const logoPath = path.join(
    process.cwd(),
    "public/segue/logos/segue_logo.png"
  );
  const facebookLogoPath = path.join(
    process.cwd(),
    "public/segue/icons/social/facebookLogo.png"
  );
  const twitterLogoPath = path.join(
    process.cwd(),
    "public/segue/icons/social/twitterLogo.png"
  );
  const instagramLogoPath = path.join(
    process.cwd(),
    "public/segue/icons/social/instagramLogo.png"
  );
  const linkedinLogoPath = path.join(
    process.cwd(),
    "public/segue/icons/social/linkedinLogo.png"
  );

  const logoBase64 = await getLogoBase64(logoPath);
  const facebookLogoBase64 = await getSocialLogoBase64(facebookLogoPath);
  const twitterLogoBase64 = await getSocialLogoBase64(twitterLogoPath);
  const instagramLogoBase64 = await getSocialLogoBase64(instagramLogoPath);
  const linkedinLogoBase64 = await getSocialLogoBase64(linkedinLogoPath);

  const attachments = [
    {
      filename: "logo.png",
      content: logoBase64,
      encoding: "base64",
      cid: "logo",
    },
    {
      filename: "facebook_logo.png",
      content: facebookLogoBase64,
      encoding: "base64",
      cid: "facebookLogo",
    },
    {
      filename: "twitter_logo.png",
      content: twitterLogoBase64,
      encoding: "base64",
      cid: "twitterLogo",
    },
    {
      filename: "instagram_logo.png",
      content: instagramLogoBase64,
      encoding: "base64",
      cid: "instagramLogo",
    },
    {
      filename: "linkedin_logo.png",
      content: linkedinLogoBase64,
      encoding: "base64",
      cid: "linkedinLogo",
    },
  ];

  const completeContent = {
    attachments: attachments,
    logoBase64: logoBase64,
    facebookLogoBase64: facebookLogoBase64,
    twitterLogoBase64: twitterLogoBase64,
    instagramLogoBase64: instagramLogoBase64,
    linkedinLogoBase64: linkedinLogoBase64,
  };
  return completeContent;
}

// enable subscribing to alerts observable
function send(confirmation: string, emailAddress: string) {
  const to = "noreply@website.dev"; // WHo the email is to
  const from = "noreply@website.dev"; // Add this to ENV

  const htmlBody = "";
}

const socialLogos = {
  facebookLogo: "facebookLogo",
  twitterLogo: "twitterLogo",
  instagramLogo: "instagramLogo",
  linkedinLogo: "linkedinLogo",
};

function createHeader() {
  return `
    <div style="display: flex; justify-content: center; width: 100%;">
      <img src="cid:logo" alt="Logo" style="width: auto; height: 200px;">
    </div>`;
}

function createFooter(
  facebookUrl,
  twitterUrl,
  instagramUrl,
  linkedinUrl,
  socialLogos
) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
      <tr>
        <td align="center">
          <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; margin-bottom: 15px;">
            <tr>
              <td style="padding-right: 10px;"><a href="${encodeURIComponent(
                facebookUrl
              )}"><img src="cid:${
    socialLogos.facebookLogo
  }" alt="Logo" style="width: auto; height: 50px;"/></a></td>
              <td style="padding-right: 10px;"><a href="${encodeURIComponent(
                twitterUrl
              )}"><img src="cid:${
    socialLogos.twitterLogo
  }" alt="Logo" style="width: auto; height: 50px;"/></a></td>
              <td style="padding-right: 10px;"><a href="${encodeURIComponent(
                instagramUrl
              )}"><img src="cid:${
    socialLogos.instagramLogo
  }" alt="Logo" style="width: auto; height: 50px;"/></a></td>
              <td><a href="${encodeURIComponent(linkedinUrl)}"><img src="cid:${
    socialLogos.linkedinLogo
  }" alt="Logo" style="width: auto; height: 50px;"/></a></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center">
          <a href="${process.env.BASE_URL}/login" >Login To Segue</a><br>
          <a href="${process.env.BASE_URL}/help">Segue Help</a>
          <p>SEGUE is a lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.</p>
          <small style="font-size: small;">SEGUE is a trading name of JENDAGI PRODUCTIONS LIMITED (SC546989), registered in Scotland at 10 Newton Terrace, Glasgow, Scotland, G3 7PJ</small>
        </td>
      </tr>
    </table>`;
}

async function sendInvite(user) {
  try {
    const facebookUrl = process.env.facebookUrl;
    const twitterUrl = process.env.twitterUrl;
    const instagramUrl = process.env.instagramUrl;
    const linkedinUrl = process.env.linkedinUrl;

    const { attachments, logoBase64 } = await createAttachmentsAndLogos();
    const header = createHeader();
    const footer = createFooter(
      facebookUrl,
      twitterUrl,
      instagramUrl,
      linkedinUrl,
      socialLogos
    );
    const subject = "Welcome to Segue - you have been invited";

    const link = `http://localhost:3000/account-actions/${user.UserId}/activate/${user.Guid}`;

    const plainText =
      `Hello ${user.UserName},\n` +
      "\n" +
      "Thank you for signing up for our service! We're glad to have you on board.\n" +
      "\n" +
      "To activate your account and start using our service, please click the link below:\n" +
      "\n" +
      `"${link}\n` +
      "\n" +
      "If you have any questions or need help getting started, please don't hesitate to reach out. We're here to help!\n";

    const htmlBody = `
    <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
    <div style="display: inline-block; text-align: center;">
            ${header}
          <p>Hello <b>${user.UserName}</b>,</p>
          <p>Thank you for signing up for our service! We're glad to have you on board.</p>
          <p>To activate your account and start using our service, please click the link below:</p>
          <p><a href="${link}">[Activation Link]</a></p>
          <p>or copy and paste ${link} into your browser</p>
          <p>If you have any questions or need help getting started, please don't hesitate to reach out. We're here to help!</p>
          <div style="display:flex; justify-content: center;">
            ${footer}     
        </div>
          </div>
      </div>
      `;
    sendEmail(user.EmailAddress, subject, plainText, htmlBody, attachments);
  } catch (error) {
    console.error(error);
  }
}

async function sendForgottenPassword(user) {
  const facebookUrl = process.env.facebookUrl;
  const twitterUrl = process.env.twitterUrl;
  const instagramUrl = process.env.instagramUrl;
  const linkedinUrl = process.env.linkedinUrl;

  const { attachments, logoBase64 } = await createAttachmentsAndLogos();
  const header = createHeader();
  const footer = createFooter(
    facebookUrl,
    twitterUrl,
    instagramUrl,
    linkedinUrl,
    socialLogos
  );
  const subject = "Password Reset Request";

  const link = `${process.env.BASE_URL}/account-actions/${user.UserId}/reset/${user.Guid}`;

  const plainText =
    `Dear ${user.UserName},\n` +
    "\n" +
    "We have received a request to reset the password for your Segue account. If you did not make this request, you can safely ignore this email.\n" +
    "\n" +
    `To reset your password, please click on the following link: ${link}\n` +
    "\n" +
    `If you are unable to click on the link, you can also visit the password reset page at [Insert password reset page URL] and enter the following reset code: [Insert reset code]\n` +
    "\n" +
    "This password reset link is only valid for the next 24 hours. After that, you will need to request a new password reset.";

  const htmlBody = `
    <div>
    <table width="100%" height="100vh" cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
    <tr>
    ${header}
        <td align="center" valign="middle">
        </td >
        </tr>
      <tr>
        <td align="center" valign="middle">
            <p>Dear ${user.UserName},</p>
            <p>We have received a request to reset the password for your Segue account. If you did not make this request, you can safely ignore this email.</p>
            <p>To reset your password, please click on the following link: <a href="${link}">Reset</a></p>
            </td>
            </tr>
            <tr>
            <td align="center" valign="middle">
            <p>If you are unable to click on the link, you can also copy the following URL into your browser to visit the password reset page at <a href="${link}">${link}</a></p>
            <p>This password reset link is only valid for the next 24 hours. After that, you will need to request a new password reset.</p>
            </td>
            </tr>
            </table>
            ${footer}
    </div>`;

  sendEmail(user.EmailAddress, subject, plainText, htmlBody, attachments);
}

function deleteUser(details) {
  const subject = "User Deletion";

  const plainText =
    `Dear Administrator,\n` +
    "\n" +
    "An User has been deleted from Segue and taske Reallocated to \n" +
    "\n";

  const htmlBody =
    `<p>Dear Administator</p>\n` + "<p>A user has been removed from Segue</p>";
  sendEmail("test@test.com", subject, plainText, htmlBody);
}

/**
 * Set this up in .env
 */
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
  // host: process.env.MAIL_HOST,
  // port: process.env.MAIL_PORT,
  // secure: false,//process.env.MAIL_SSL,

  // tls: {
  //      ciphers:'SSLv3'
  // }
});
/**
 *
 * Below Functions are used to send an email generated above
 *
 * @param to
 * @param from
 * @param subject
 * @param text
 * @param html
 */

function sendEmail(recipient, subject, text, html, attachment = []) {
  console.log("EMAIL", process.env.GMAIL_EMAIL, process.env.GMAIL_PASS);
  const mailOptions = {
    from: process.env.MAIL_FROM_ADDRESS,
    to: recipient,
    subject: subject,
    text: text,
    html: html,

    attachments: attachment,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

/**
 *
 *
 *  Outlook
 *
 *
 *
 * service: "Outlook365",
 * auth: {
 *    user: '[YOUR_O365_EMAIL]',
 *    pass: '[YOUR_O365_PASSWORD]'
 * },
 *
 */
