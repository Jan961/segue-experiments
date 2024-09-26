import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from 'services/emailService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { to, from, templateName, data } = req.body;
    await sendEmail(to, from, templateName, data);
    return res.status(200).json({ success: true });
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error sending email' });
  }
}
