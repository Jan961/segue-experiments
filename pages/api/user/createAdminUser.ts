import { userMapper } from 'lib/mappers';
import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

const getPermissions = async () => {
  const permissions = await prisma.permission.findMany({
    select: {
      PermissionId: true,
    },
  });
  return permissions.map(({ PermissionId }) => ({ UserAuthPermissionId: PermissionId }));
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = req.body;

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

    const { AccountOrganisationId } = await prisma.account.findFirst({
      where: {
        AccountName: user.companyName,
        AccountMainEmail: user.email,
      },
      select: {
        AccountOrganisationId: true,
      },
    });

    if (!AccountOrganisationId) {
      res.status(500).json({ err: 'OrganisationId not found when creating user' });
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
            AccUserIsAdmin: true,
            AccUserIsActive: true,
            Account: {
              connect: {
                AccountOrganisationId,
              },
            },
            AccountUserPermission: {
              createMany: {
                data: await getPermissions(),
              },
            },
          },
        },
      },
      include: {
        AccountUser: true,
      },
    });

    if (newUser) {
      console.log('Updating PIN', AccountOrganisationId, user.pin);
      await prisma.account.update({
        where: {
          AccountOrganisationId,
        },
        data: {
          AccountPIN: user.pin,
        },
      });
    }

    res.status(200).json(userMapper(newUser));
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating the user.' });
  }
}
