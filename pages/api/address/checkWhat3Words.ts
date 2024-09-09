import type { NextApiRequest, NextApiResponse } from 'next';
import { getCoordFromWhat3Words } from 'services/getCoordFromWhat3Words';
import { getAccountIdFromReq } from 'services/userService';
import prisma from 'lib/prisma_master';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { searchTerm } = req.body;
    const accountId = await getAccountIdFromReq(req);
    const queryResult = await prisma.Account.findFirst({
      where: { AccountId: accountId },
      select: { AccountW3WCount: true },
    });
    const numTokensLeft = queryResult?.AccountW3WCount;
    if (numTokensLeft > 0) {
      const result = await getCoordFromWhat3Words(searchTerm);
      const { isError } = result;
      if (!isError) {
        await prisma.Account.update({ where: { AccountId: accountId }, data: { AccountW3WCount: numTokensLeft - 1 } });
      }
      res.status(isError ? 401 : 200).json(result);
    } else {
      res.status(403).json({ isError: true, message: 'No more What3Words tokens' });
    }
  }
  res.status(400);
}
