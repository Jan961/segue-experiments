import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { SpreadsheetData } from 'types/SpreadsheetValidationTypes';

interface RequestBody {
  spreadsheetData: SpreadsheetData;
  productionID: number;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { spreadsheetData, productionID }: RequestBody = req.body;

    // Find DateBlock for ProductionID that isPrimary
    const primaryDateBlock = await prisma.DateBlock.findFirst({
      where: { ProductionId: { equals: productionID } },
      select: { Id: true },
    });

    // Get VenueIDs for VenueCodes
    const venueCodes = spreadsheetData.venues.map((venue) => venue.venueCode);
    const venueIDs = await prisma.Venue.findMany({
      where: {
        Code: {
          in: venueCodes,
        },
      },
      select: {
        Id: true,
        Code: true,
      },
    });
    console.log(venueIDs);

    // Create Bookings for each listed Booking
    const newBookings = [];
    for (const venue of spreadsheetData.venues) {
      for (const booking of venue.bookings) {
        const matchingVenue = venueIDs.find((venueID) => venueID.Code === venue.venueCode);
        if (matchingVenue) {
          console.log(primaryDateBlock, booking);
        }
      }
    }
    console.log(newBookings);

    res.status(200).json({ status: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error Creating Production File' });
  }
}
