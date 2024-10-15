import prismaMaster from 'lib/prisma_master';
import getPrismaClient from 'lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';
import { getOrganisationIdFromReq } from 'services/userService';

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
      const formattedProductionPermissions = productionPermissions.map((perm) => perm.AUPProductionId.toString());
      const accountId = await getOrganisationIdFromReq(req);
      const countAdminUsers = await prismaMaster.AccountUser.count({
        where: { AccUserIsAdmin: true, Account: { AccountOrganisationId: accountId } },
      });

      const results = {
        pin: userPermissions?.AccUserPIN,
        isAdmin: userPermissions?.AccUserIsAdmin,
        permissions: formattedUserPermissions || [],
        productions: formattedProductionPermissions || [],
        isSingleAdminUser: countAdminUsers === 1 && userPermissions?.AccUserIsAdmin,
      };

      res.status(200).json(results);
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}
