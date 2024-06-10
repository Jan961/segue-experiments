import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { to, from, templateId, data } = req.body;
    const msg = {
      to,
      from,
      templateId,
      dynamicTemplateData: data,
    };
    await sgMail.send(msg);
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error sending email' });
  }
}
