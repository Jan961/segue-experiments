import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma_master';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { groupId } = req.body;

    await prisma.PermissionGroup.delete({
      where: {
        PerGpId: groupId,
      },
    });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while deleting permission group.' + err });
  }
}
