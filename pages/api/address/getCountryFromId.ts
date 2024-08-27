import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { isNullOrEmpty } from 'utils';
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { CountryId } = req.body;
    const result = await prisma.Country.findFirst({ where: { Id: CountryId } });
    res.status(isNullOrEmpty(result) ? 401 : 200).json(result);
  }
  res.status(400);
}
