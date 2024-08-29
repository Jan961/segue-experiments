import { NextApiRequest, NextApiResponse } from 'next';
import { createUserSession } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, organisationId } = req.body;
    const response = await createUserSession(email, organisationId);
    return res.status(200).json({ success: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating the session.' });
  }
}
