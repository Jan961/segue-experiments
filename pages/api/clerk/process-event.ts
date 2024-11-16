import { WebhookEvent } from '@clerk/nextjs/dist/types/server';
import { NextApiRequest, NextApiResponse } from 'next';
import { Webhook } from 'svix';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;

const validateRequest = async (req: NextApiRequest) => {
  const payloadString = await JSON.stringify(req.body);
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
  const payload = await validateRequest(req);
  if (payload?.type === 'user.created') {
    res.status(200).json({ message: 'success' });
  }
};

export default handler;
