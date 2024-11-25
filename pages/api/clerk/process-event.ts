import { WebhookEvent } from '@clerk/nextjs/dist/types/server';
import { NextApiRequest, NextApiResponse } from 'next';

import { sendVerificationEmail } from 'services/emailService';
import { Webhook } from 'svix';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;

const EMAIL_CREATED = 'email.created';

const validateRequest = async (req: NextApiRequest) => {
  const payloadString = JSON.stringify(req.body);
  const headers = req.headers;
  const svixHeaders = {
    'svix-id': headers['svix-id'].toString(),
    'svix-timestamp': headers['svix-timestamp'].toString(),
    'svix-signature': headers['svix-signature'].toString(),
  };

  const wh = new Webhook(webhookSecret);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const payload = await validateRequest(req);
    if (payload.type === EMAIL_CREATED) {
      await sendVerificationEmail(payload.data.to_email_address, payload.data.data.magic_link);
      res.status(200).json({ success: true });
    }
    res.status(401).json({ success: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

export default handler;
