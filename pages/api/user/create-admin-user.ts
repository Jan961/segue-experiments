import prisma from 'lib/prisma_master';
import { createPrismaClient } from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAllPermissionsWithIdAndName } from 'services/permissionService';
import { createNewAccountUser, createNewUser } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user, accountUserOnly = false } = req.body;

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
    const permissions = await getAllPermissionsWithIdAndName();
    const permissionIds = permissions.map(({ PermissionId }) => ({ UserAuthPermissionId: PermissionId }));

    const newUser = accountUserOnly
      ? await createNewAccountUser(user, AccountOrganisationId, permissionIds)
      : await createNewUser(user, AccountOrganisationId, permissionIds);

    if (!accountUserOnly && newUser) {
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
      const productions = await prismaClient.production.findMany();

      const formattedProductions = productions.map(({ Id }) => ({
        AUPProductionId: Id,
        AUPAccUserId: newUser.AccountUser[0].AccUserId,
      }));

      await prismaClient.accountUserProduction.createMany({
        data: formattedProductions,
      });
    }

    const formattedPermissions = permissions.map(({ PermissionName }) => PermissionName);
    const accountUser = accountUserOnly
      ? { organisationId: AccountOrganisationId, permissions: formattedPermissions }
      : { success: true };
    res.status(200).json(accountUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while creating the user.' });
  }
}