import { NextApiRequest, NextApiResponse } from 'next';
import { getPermissionsList } from 'services/permissionService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results = await getPermissionsList();
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: 'Error occurred while fetching permissions.' + err });
  }
}
