import { NextApiRequest, NextApiResponse } from 'next';
import { deleteUserSession } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body;
    const response = await deleteUserSession(email);
    return res.status(200).json({ success: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while deleting the session.' });
  }
}
