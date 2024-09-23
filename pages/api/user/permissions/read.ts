import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, getUserPermisisons } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const orgId = req.query.organisationId as string;
    const email = await getEmailFromReq(req);
    const permissions = await getUserPermisisons(email, orgId);
    return res.status(200).json(permissions);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error fetching user permissions.' });
  }
}
