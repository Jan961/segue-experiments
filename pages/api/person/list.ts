import { NextApiRequest, NextApiResponse } from 'next';
import { fetchAllMinPersonsList } from 'services/personService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await fetchAllMinPersonsList(req);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: 'Error occurred while generating search results. ' + err });
  }
}
