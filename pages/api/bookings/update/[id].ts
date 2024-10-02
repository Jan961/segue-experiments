import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

const mapToPrisma = (fields) => {
  return {
    LandingPageURL: fields.landingPageUrl,
    TicketsOnSale: fields.ticketsOnSale,
    TicketsOnSaleFromDate: fields.ticketsOnSaleFromDate,
    MarketingPlanReceived: fields.marketingPlanReceived,
    PrintReqsReceived: fields.printReqsReceived,
    ContactInfoReceived: fields.contactInfoReceived,
    MarketingCostsStatus: fields.marketingCostsStatus,
    MarketingCostsApprovalDate: fields.marketingCostsApprovalDate,
    MarketingCostsNotes: fields.marketingCostsNotes,
    CastRateTicketsArranged: fields.castRateTicketsArranged,
    CastRateTicketsNotes: fields.castRateTicketsNotes,
    SalesNotes: fields.salesNotes,
    HoldNotes: fields.holdNotes,
    CompNotes: fields.compNotes,
    FinalSalesDiscrepancyNotes: fields.finalSalesDiscrepancyNotes,
    HasSchoolsSales: fields.hasSchoolsSales,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    const prisma = await getPrismaClient(req);
    const BookingId = parseInt(req.query.id as string, 10);
    const bookingUpdate = mapToPrisma(req.body);

    const updatedBooking = await prisma.booking.update({
      where: {
        ...(BookingId && { Id: BookingId }),
      },
      data: {
        ...bookingUpdate,
      },
    });
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating Booking:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
