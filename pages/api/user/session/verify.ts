import { NextApiRequest, NextApiResponse } from 'next';
import { isSessionActive } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = req.query.email as string;
    const response = await isSessionActive(email);
    return res.status(200).json({ isActive: !!response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while fetching user session.' });
  }
}
