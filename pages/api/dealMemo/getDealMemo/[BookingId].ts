import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId: number = parseInt(req.query.BookingId as string);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();
    let dealMemo = await prisma.dealMemo.findFirst({
      where: {
        BookingId,
      },
      include: {
        DealMemoPrice: true,
        DealMemoTechProvision: true,
        DealMemoCall: true,
        DealMemoHold: true,
      },
    });

    const emailSalesRecipients = await prisma.DealMemoSalesEmailRecipient.findMany({
      where: {
        DMSRDeMoId: dealMemo.Id,
      },
    });

    dealMemo = { ...dealMemo, SendTo: emailSalesRecipients.map((recipient) => recipient.DMSRAccUserId) };

    res.status(200).json(dealMemo);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while getting data for Deal Memo' });
  }
}
