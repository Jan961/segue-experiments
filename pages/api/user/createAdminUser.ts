import { userMapper } from 'lib/mappers';
import prisma from 'lib/prisma_master';
import { createPrismaClient } from 'lib/prisma';
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

    const prismaClient = await createPrismaClient(AccountOrganisationId);
    const permissions = await getPermissions();

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
                data: permissions,
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
      // Set PIN for the account
      await prisma.account.update({
        where: {
          AccountOrganisationId,
        },
        data: {
          AccountPIN: user.pin,
        },
      });

      // Create Production permisisons
      const productions = (await prismaClient.production.findMany({})).map(({ Id }) => ({
        AUPProductionId: Id,
        AUPAccUserId: newUser.AccUserId,
      }));

      await prismaClient.accountUserProduction.createMany({
        data: productions,
      });
    }
    const accountUser = userMapper(newUser);
    res.status(200).json({ user: accountUser, organisationId: AccountOrganisationId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating the user.' });
  }
}
