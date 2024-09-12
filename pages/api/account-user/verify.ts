import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, organisationId, pin } = req.body;
    const accountUser = await prisma.AccountUser.findFirst({
      where: {
        User: {
          UserEmail: {
            equals: email,
          },
        },
        Account: {
          AccountOrganisationId: {
            equals: organisationId,
          },
        },
        AccUserPIN: {
          equals: pin,
        },
      },
      select: {
        Account: true,
        AccountUserPermission: {
          select: {
            Permission: true,
          },
        },
      },
    });

    const formattedPermissions =
      accountUser?.AccountUserPermission.map(({ Permission }) => ({
        permissionId: Permission.PermissionId,
        permissionName: Permission.PermissionName,
      })) || [];

    return res.status(200).json({ isValid: accountUser !== null, permissions: formattedPermissions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while verifying user' });
  }
}
