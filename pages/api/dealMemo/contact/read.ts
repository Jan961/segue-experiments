import master from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const accUserId: number = parseInt(req.query.accUserId as string);

    const contact = await master.AccountUser.findUnique({
      where: {
        AccUserId: accUserId,
      },
      include: {
        User: {
          select: {
            UserFirstName: true,
            UserLastName: true,
          },
        },
        Account: {
          include: {
            AccountContact: {
              where: {
                AccContFirstName: (
                  await master.AccountUser.findUnique({
                    where: { AccUserId: parseInt(accUserId.toString()) },
                    select: { User: { select: { UserFirstName: true } } },
                  })
                ).User.UserFirstName,
                AccContLastName: (
                  await master.AccountUser.findUnique({
                    where: { AccUserId: parseInt(accUserId.toString()) },
                    select: { User: { select: { UserLastName: true } } },
                  })
                ).User.UserLastName,
              },
            },
          },
        },
      },
    });

    const accountContact = contact?.Account?.AccountContact?.[0] || null;

    res.status(200).json(accountContact);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while getting data for contacts' });
  }
}
