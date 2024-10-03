import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    /* const BookingId = parseInt(req.query.BookingId as string);
    const prisma = await getPrismaClient(req);

    const updateResult = await prisma.booking.update({
      where: {
        BookingId,
      },
      data: {
        VenueContractStatus: req.body.VenueContractStatus,
        DealType: req.body.DealType,
        ContractSignedDate: new Date(req.body.ContractSignedDate),
        ContractSignedBy: req.body.ContractSignedBy,
        BankDetailsReceived: req.body.BankDetailsReceived,
        RoyaltyPC: req.body.RoyaltyPC,
        CrewNotes: req.body.CrewNotes,
        MarketingDealNotes: req.body.MarketingDealNotes,
        TicketPriceNotes: req.body.TicketPriceNotes,
        BarringExemptions: req.body.BarringExemptions,
        ContractNotes: req.body.ContractNotes,
        GP: req.body.GP,
        ContractReturnDate: new Date(req.body.ContractReturnDate),
        ContractReceivedBackDate: new Date(req.body.ContractReceivedBackDate),
        ContractCheckedBy: req.body.ContractCheckedBy,
      },
    }); */

    return res.json(null);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}
