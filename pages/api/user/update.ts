import prismaMaster from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';
import { replaceProudctionPermissions, replaceUserPermissions } from 'services/permissionService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userDetails = req.body;

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
              AccUserPIN: userDetails.pin,
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
