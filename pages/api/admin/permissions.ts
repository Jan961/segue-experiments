import { getEmailFromReq } from 'services/userService';
import prisma from 'lib/prismaAccelerate';
import { Prisma } from '@prisma/client';

// type UncapitalizedModelName = Uncapitalize<Prisma.ModelName>;

export default async function handle(req, res) {
  try {
    const email = await getEmailFromReq(req);

    const data = await prisma.permissionGroup.findMany({ include: { Permission: true } });
    console.log('Data ', data);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}
