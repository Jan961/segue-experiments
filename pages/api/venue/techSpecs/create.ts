import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export type VenueTechSpecsAttachedFile = {
  FileId: number;
  VenueId: number;
  Description: string;
  Type?: string;
};

// FileId: response.data.FileId,
//           VenueId: venueResponse.data.Id,
//           Description: 'Tech Spec',

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body);
  const data = req.body;
  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, {});
  if (!access) return res.status(401).end();
  console.log({ ...data, Type: 'Tech Specs' });
  const result = await prisma.VenueFile.create({
    data: { ...data, Type: 'Tech Specs' },
  });
  res.status(200).json(result);
}
