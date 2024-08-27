import type { NextApiRequest, NextApiResponse } from 'next';
import { getCoordFromWhat3Words } from 'services/getCoordFromWhat3Words';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { searchTerm } = req.body;
    const result = await getCoordFromWhat3Words(searchTerm);
    res.status(result.isError ? 401 : 200).json(result);
  }
  res.status(400);
}
