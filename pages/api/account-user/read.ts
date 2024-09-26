import prisma from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, firstName, lastName, organisationId } = req.query;
    const users = await prisma.AccountUser.findMany({
      where: {
        Account: {
          AccountOrganisationId: {
            equals: organisationId,
          },
        },
        User: {
          OR: [
            {
              UserEmail: {
                equals: email,
              },
            },
            {
              AND: [
                {
                  UserFirstName: {
                    equals: firstName,
                  },
                },
                {
                  UserLastName: {
                    equals: lastName,
                  },
                },
              ],
            },
          ],
        },
      },
      select: {
        User: true,
      },
    });
    const formattedUsers = users.map(({ User }) => ({
      email: User.UserEmail,
      firstName: User.UserFirstName,
      lastName: User.UserLastName,
    }));
    return res.status(200).json({ users: formattedUsers });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while getting user' });
  }
}
