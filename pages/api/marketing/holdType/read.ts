import prisma from 'lib/prisma';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req, res) {
  try {
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    const holdTypes = await prisma.$queryRaw`select * from HoldType`;

    const formattedHolds = holdTypes.map((type) => {
      return {
        name: type.HoldTypeName,
        code: type.HoldTypeCode,
        seq: type.HoldTypeSeqNo,
      };
    });

    const sortedResult = formattedHolds.sort((a, b) => a.seq - b.seq);

    res.status(200).json(sortedResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting PerformanceLastDates.' });
  }
}
