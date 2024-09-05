import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { SpreadsheetDataClean } from 'types/SpreadsheetValidationTypes';
import { getDateBlockForProduction } from 'services/dateBlockService';
// import { deleteAllDateBlockEvents } from 'services/dateBlockService';
import { AddBookingsParams } from 'pages/api/bookings/interface/add.interface';

interface RequestBody {
  spreadsheetData: SpreadsheetDataClean;
  productionID: number;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { spreadsheetData, productionID }: RequestBody = req.body;

    // Find DateBlock for ProductionID that isPrimary
    const primaryDateBlock = await getDateBlockForProduction(productionID, true);
    const primaryDateBlockID = primaryDateBlock.Id;

    // Delete all associated Bookings/Rehearsals/GetInFitUp/Other events for that Primary Date Block - to be replaced.
    // await deleteAllDateBlockEvents(primaryDateBlock.Id)

    // Get VenueIDs for each VenueCode in SpreadsheetData
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

    // Create Bookings for each listed Booking in the spreadsheetData
    const bookingsToCreate: AddBookingsParams[] = [];
    for (const venue of spreadsheetData.venues) {
      for (const booking of venue.bookings) {
        const venueId = venueIDs.find((venueID) => venueID.Code === venue.venueCode)?.Id;
        if (venueId) {
          bookingsToCreate.push({
            DateBlockId: primaryDateBlockID,
            VenueId: venueId,
            isBooking: true,
            Notes: '',
            BookingDate: booking.bookingDate,
            StatusCode: 'C',
            PencilNum: null,
            Performances: null,
            RunTag: '...',
          });
        }
      }
    }
    console.log(bookingsToCreate);

    res.status(200).json({ status: 'Success' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error Creating Production File' });
  }
}
