import { clerkClient } from '@clerk/nextjs';
import prismaMaster from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';
import { replaceProudctionPermissions, replaceUserPermissions } from 'services/permissionService';
import { getClerkUserByEmailAddress, getOrganisationIdFromReq, getUserPermisisons } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userDetails = req.body;
    const accountId = await getOrganisationIdFromReq(req);

    // check if this user is the only system adminstrattor. If so, reject the update
    if (!userDetails.isSystemAdmin) {
      const countAdminUsers = await prismaMaster.AccountUser.count({
        where: { AccUserIsAdmin: true, Account: { AccountOrganisationId: accountId } },
      });

      if (countAdminUsers === 1) {
        res.status(200).json({ error: 'At least one System Administrator is required for this account' });
        return;
      }
    }
    const user = await getClerkUserByEmailAddress(userDetails.email);
    const updatedUSer = await prismaMaster.user.update({
      data: {
        UserFirstName: userDetails.firstName,
        UserLastName: userDetails.lastName,
        AccountUser: {
          update: {
            where: {
              AccUserId: userDetails.accountUserId,
            },
            data: {
              AccUserIsAdmin: userDetails.isSystemAdmin,
            },
          },
        },
      },
      include: {
        AccountUser: true,
      },
      where: {
        UserEmail: userDetails.email,
      },
    });
    await replaceUserPermissions(userDetails.accountUserId, userDetails.permissions);
    await replaceProudctionPermissions(userDetails.accountUserId, userDetails.productions, req);
    if (user?.unsafeMetadata?.organisationId === accountId) {
      const permissions = await getUserPermisisons(userDetails.email, accountId);
      await clerkClient.users.updateUserMetadata(user.id, {
        unsafeMetadata: { permissions, organisationId: accountId, accessibleProductions: userDetails.productions },
      });
    }
    return res.json(updatedUSer);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while updating the user.' });
  }
}
