import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { ShowDTO } from 'interfaces';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const show: ShowDTO = req.body;
  const email = await getEmailFromReq(req);
  const AccountId = await getAccountId(email);

  try {
    await prisma.show.create({
      data: { ...show, AccountId },
    });

    res.status(200).end();
  } catch (error) {
    console.log(error);
    if (error.code === 'P2002' && error.meta && error.meta.target.includes('SECONDARY')) {
      // The target might not exactly match 'SECONDARY', depending on Prisma version and database
      res.status(409).json({ error: 'A show with the specified AccountId and Code already exists.' });
    } else {
      res.status(500).json({ error: `Error occurred while creating Show ${error?.message}`, ok: false });
    }
  }
}
