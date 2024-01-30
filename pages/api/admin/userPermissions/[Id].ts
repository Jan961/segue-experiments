import prisma from 'lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';

// type UncapitalizedModelName = Uncapitalize<Prisma.ModelName>;

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const Id = parseInt(req.query.Id as string);

      const data = await prisma.AccountUser.findUnique({
        where: { Id },
        select: { AccountUserPermission: { select: { PermissionId: true } } },
      });

      res.status(200).json(data?.AccountUserPermission || []);
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}
