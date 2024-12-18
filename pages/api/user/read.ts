import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

const formatUser = (user: any) => {
  return {
    email: user.UserEmail,
    firstName: user.UserFirstName,
    lastName: user.UserLastName,
    displayName: user.UserDisplayName,
    isActive: user.UserActive,
    needsPasswordReset: user.UserPasswordResetRequired,
  };
};
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = req.query.email as string;
    const user = await prisma.user.findUnique({
      where: {
        UserEmail: email,
      },
    });

    const formattedUser = user ? formatUser(user) : null;
    return res.status(200).json(formattedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while deleting the user.' });
  }
}
