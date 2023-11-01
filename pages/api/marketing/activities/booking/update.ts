import { loggingService } from 'services/loggingService';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAccess, getEmailFromReq } from 'services/userService';

export interface MarketingActivitiesBookingInfoParams {
  Id: number;
  IsOnSale?: boolean;
  OnSaleDate?: string;
  MarketingPlanReceived?: boolean;
  ContactInfoReceived?: boolean;
  PrintReqsReceived?: boolean;
  CastRateTicketsArranged?: boolean;
  CastRateTicketsNotes?: boolean;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { Id, ...updatedData } = req.body as MarketingActivitiesBookingInfoParams;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId: Id });
    if (!access) return res.status(401).end();

    await prisma.booking.update({
      where: {
        Id,
      },
      data: updatedData,
    });
    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error updating Booking' });
  }
}
