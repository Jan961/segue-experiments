import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handle(req, res) {
  console.log(req.body.CrewNotes)
  try {
    let bookingId = parseInt(req.query.bookingId);
    const updateResult = await prisma.booking.update({
      where: {
        BookingId: bookingId,
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
    });

    await res.json(updateResult);
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err: "Error occurred while generating search results." });
  }
}
