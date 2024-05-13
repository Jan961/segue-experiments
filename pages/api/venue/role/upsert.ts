import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

const mapToPrismaFields = ({ id: Id, name: Name, isStandard: IsStandard = false }) => ({ Id, Name, IsStandard });
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const role = mapToPrismaFields(req.body);
    if (!role.Name) {
      res.status(404).json({ ok: false, message: 'name is required' });
    }
    const updatedRole = prisma.VenueRole.upsert({
      where: {
        Id: role.Id || -1,
      },
      create: { ...role },
      update: { ...role },
    });
    res.status(200).json({ ...updatedRole });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

export default handler;
