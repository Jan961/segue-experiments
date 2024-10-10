import prismaMaster from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';
import { replaceProudctionPermissions, replaceUserPermissions } from 'services/permissionService';
import { getOrganisationIdFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userDetails = req.body;

    // check if this user is the only system adminstrattor. If so, reject the update
    if (!userDetails.isSystemAdmin) {
      const accountId = await getOrganisationIdFromReq(req);
      const countAdminUsers = await prismaMaster.AccountUser.count({
        where: { AccUserIsAdmin: true, Account: { AccountOrganisationId: accountId } },
      });
      console.log('countAdminUsers', countAdminUsers);
      if (countAdminUsers === 1) {
        res.status(200).json({ error: 'At least one System Administrator is required for this account' });
        return;
      }
    }

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

    return res.json(updatedUSer);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while updating the user.' });
  }
}
