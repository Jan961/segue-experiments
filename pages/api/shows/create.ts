import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import * as yup from 'yup';
import { ShowDTO } from 'interfaces';
import { getAccountId, getEmailFromReq } from 'services/userService';
import { showSchema } from 'validators/show';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const show: ShowDTO = req.body;
  const email = await getEmailFromReq(req);
  const AccountId = await getAccountId(email);

  try {
    const validatedData = await showSchema.validate(show, { abortEarly: true });
    const result = await prisma.show.create({
      data: { ...validatedData, AccountId },
    });
    console.log('Show Created Successfully', result);
    res.status(200).end();
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else if (error.code === 'P2002' && error.meta && error.meta.target.includes('SECONDARY')) {
      // The target might not exactly match 'SECONDARY', depending on Prisma version and database
      res.status(409).json({ error: 'A show with the specified AccountId and Code already exists.' });
    } else {
      res.status(500).json({ error: `Error occurred while creating Show ${error?.message}`, ok: false });
    }
  }
}
