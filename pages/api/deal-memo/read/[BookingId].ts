import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { isNullOrEmpty } from 'utils';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId: number = parseInt(req.query.BookingId as string);

    const prisma = await getPrismaClient(req);
    const dealMemo = await prisma.dealMemo.findFirst({
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

    // if dealMemo Id is null or undefined - there isn't one - return empty object
    // also return to ensure the function does not continue to execute
    if (isNullOrEmpty(dealMemo)) {
      res.status(200).json({});
      return;
    }

    const emailSalesRecipients = await prisma.dealMemoSalesEmailRecipient.findMany({
      where: {
        DMSRDeMoId: dealMemo.Id,
      },
    });
    res.status(200).json({ ...dealMemo, SendTo: emailSalesRecipients.map((recipient) => recipient.DMSRAccUserId) });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while getting data for Deal Memo' });
  }
}
