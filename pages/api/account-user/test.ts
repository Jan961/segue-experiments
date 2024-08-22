import { getPrismaClient } from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prisma = getPrismaClient(req);
    const db = await (
      await prisma
    ).dBSetting.findUnique({
      where: {
        DBSettingId: 1,
      },
    });
    return res.status(200).json({
      updated: `${db.DBSettingName}: ${db.DBSettingValue}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while getting accounts' });
  }
}
