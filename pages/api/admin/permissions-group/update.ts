import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma_master';
import { isNullOrEmpty } from 'utils';

const getPermissions = (PGPPerGpId, permissions) => {
  return permissions.map((id) => ({ PGPPerGpId, PGPPermissionId: id }));
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { permissionGroup, accountId } = req.body;
    prisma.$transaction(async (tx) => {
      const newPermissionGroup = await tx.PermissionGroup.update({
        where: {
          PerGpId: permissionGroup.groupId,
        },
        data: {
          PerGpName: permissionGroup.groupName,
          Account: {
            connect: {
              AccountOrganisationId: accountId,
            },
          },
        },
      });

      await tx.PermissionGroupPermission.deleteMany({
        where: {
          PGPPerGpId: permissionGroup.groupId,
        },
      });
      if (!isNullOrEmpty(permissionGroup.permissions)) {
        await tx.PermissionGroupPermission.createMany({
          data: getPermissions(newPermissionGroup.PerGpId, permissionGroup.permissions),
        });
      }
    });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while updating permission group.' + err });
  }
}
