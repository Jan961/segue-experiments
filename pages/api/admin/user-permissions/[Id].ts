import prismaMaster from 'lib/prisma_master';
import getPrismaClient from 'lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const Id = parseInt(req.query.Id as string);

      const userPermissions = await prismaMaster.AccountUser.findUnique({
        where: { AccUserId: Id },
        select: {
          AccountUserPermission: { select: { UserAuthPermissionId: true } },
          AccUserIsAdmin: true,
          AccUserPIN: true,
        },
      });

      const formattedUserPermissions = userPermissions?.AccountUserPermission.map((perm) => perm.UserAuthPermissionId);
      const prismaClient = await getPrismaClient(req);
      // get prodction permissions
      const productionPermissions = await prismaClient.accountUserProduction.findMany({
        where: { AUPAccUserId: Id },
        select: { AUPProductionId: true },
      });
      const formattedProductionPermissions = productionPermissions.map((perm) => perm.AUPProductionId);

      const results = {
        pin: userPermissions?.AccUserPIN,
        isAdmin: userPermissions?.AccUserIsAdmin,
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
