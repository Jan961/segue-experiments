import master from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';
import { removeUserFromClerk } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { accountUserId, email } = req.body;

    await master.accountUser.update({
      data: {
        AccUserIsActive: false,
      },
      where: {
        AccUserId: accountUserId,
      },
    });

    await removeUserFromClerk(email);
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while deleting the user.' });
  }
}
