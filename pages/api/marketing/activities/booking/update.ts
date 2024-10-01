import { loggingService } from 'services/loggingService';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export interface MarketingActivitiesBookingInfoParams {
  Id: number;
  IsOnSale?: boolean;
  OnSaleDate?: string;
  MarketingPlanReceived?: boolean;
  ContactInfoReceived?: boolean;
  PrintReqsReceived?: boolean;
  CastRateTicketsArranged?: boolean;
  CastRateTicketsNotes?: string;
  SalesNotes?: string;
  HoldNotes?: string;
  CompNotes?: string;
  FinalSalesDiscrepancyNotes?: string;
  HasSchoolsSales?: boolean;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { Id, ...updatedData } = req.body as MarketingActivitiesBookingInfoParams;
    const prisma = await getPrismaClient(req);

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
