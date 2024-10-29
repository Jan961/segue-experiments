import { userMapper } from 'lib/mappers';
import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';
import { getOrganisationIdFromReq } from 'services/userService';

const getUserPermissions = (permissions) => {
  return permissions.map((id) => ({ UserAuthPermissionId: id }));
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = req.body;

    const organisationId = await getOrganisationIdFromReq(req);
    if (!organisationId) {
      res.status(500).json({ err: 'OrganisationId not found when creating user' });
      return;
    }
    // Check if the user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        UserEmail: user.email,
      },
    });

    if (existingUser) {
      res.status(200).json({ error: 'User already exists.' });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        UserIsActive: true,
        UserFirstName: user.firstName,
        UserLastName: user.lastName,
        UserEmail: user.email,
        AccountUser: {
          create: {
            AccUserIsAdmin: user.isSystemAdmin,
            AccUserIsActive: true,
            Account: {
              connect: {
                AccountOrganisationId: organisationId,
              },
            },
            AccountUserPermission: {
              createMany: {
                data: getUserPermissions(user.permissions),
              },
            },
          },
        },
      },
      include: {
        AccountUser: true,
      },
    });

    res.status(200).json(userMapper(newUser));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating the user.' });
  }
}
