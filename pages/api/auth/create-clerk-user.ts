import { NextApiRequest, NextApiResponse } from 'next';
import { createClerkUserWithoutSession } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password, firstName, lastName } = req.body;
    const response = await createClerkUserWithoutSession(email, password, firstName, lastName);
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    if (e.clerkError) {
      const { message } = e.errors[0];
      res.status(200).json({ error: message });
      return;
    }
    res.status(500).json({ err: 'Error creating clerk user' });
  }
}
