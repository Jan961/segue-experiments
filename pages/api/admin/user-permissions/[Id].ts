import prismaMaster from 'lib/prisma_master';
import prismaClient from 'lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      console.log(req.query);
      const Id = parseInt(req.query.Id as string);

      const userPermissions = await prismaMaster.AccountUser.findUnique({
        where: { AccUserId: Id },
        select: { AccountUserPermission: { select: { UserAuthPermissionId: true } } },
      });
      const formattedUserPermissions = userPermissions?.AccountUserPermission.map((perm) => perm.UserAuthPermissionId);

      // get prodction permissions
      const productionPermissions = await prismaClient.AccountUserProduction.findMany({
        where: { AUPAccUserId: Id },
        select: { AUPProductionId: true },
      });
      const formattedProductionPermissions = productionPermissions.map((perm) => perm.AUPProductionId);

      const results = {
        permissions: formattedUserPermissions || [],
        productions: formattedProductionPermissions || [],
      };

      res.status(200).json(results);
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}
