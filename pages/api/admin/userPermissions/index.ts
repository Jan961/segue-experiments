import prisma from 'lib/prisma';

import { NextApiRequest, NextApiResponse } from 'next';

const deletePermissions = (id) =>
  prisma.AccountUserPermission.deleteMany({
    where: {
      AccUserId: id,
    },
  });

const createPermissions = (permissions) =>
  prisma.AccountUserPermission.createMany({
    data: permissions,
    skipDuplicates: true,
  });

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { user, userPermissions } = req.body;
      if (!user) {
        return res.status(400).json({ error: 'missing required params' });
      }

      const permissions = userPermissions.reduce((acc, perm) => {
        if (perm.options?.length > 0) {
          const checked = perm.options
            .filter(({ checked }) => !!checked)
            .map(({ id }) => ({ AccUserId: user, PermissionId: id }));
          return [...acc, ...checked];
        }
        return acc;
      }, []);

      await prisma.$transaction([deletePermissions(user), createPermissions(permissions)]);
      return res.status(200);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while saving permissions.' });
  }
}
