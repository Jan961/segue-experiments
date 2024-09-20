import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { SpreadsheetDataCleaned } from 'types/SpreadsheetValidationTypes';
import { getDateBlockForProduction, deleteAllDateBlockEvents } from 'services/dateBlockService';
import { nanoid } from 'nanoid';
import { createNewBooking } from 'services/bookingService';
import { PrismaClient } from 'prisma/generated/prisma-client';

interface RequestBody {
  spreadsheetData: SpreadsheetDataCleaned;
  selectedProdId: number;
  fileID: number;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { spreadsheetData, selectedProdId, fileID }: RequestBody = req.body;

    // Perform Prisma queries in one transaction so that if it fails previous changes are rolled back
    await prisma.$transaction(async (tx: PrismaClient) => {
      await updateCreateProductionFile(tx, selectedProdId, fileID);
      const primaryDateBlock = await getDateBlockForProduction(selectedProdId, true);
      const primaryDateBlockID = primaryDateBlock[0].Id;
      await deleteEvents(tx, primaryDateBlockID);
      await updateSpreadsheetDataWithVenueIDs(tx, spreadsheetData);
      const bookingsWithSales = await createBookings(tx, spreadsheetData, primaryDateBlockID);
      await createSalesSetWithSales(tx, bookingsWithSales);
    });

    res.status(200).json({ status: 'Success' });
  } catch (error) {
    console.error('An unexpected error has occured whilst updating the database with sales data.', error);
    res.status(500).json({ error });
  }
}

const updateCreateProductionFile = async (client: PrismaClient, selectedProdId: number, fileID: number) => {
  // The reason we check to make sure there is no already uploaded production file,
  // is because only one file should be able to have been uploaded, and we don't want to
  // somehow accidentally overwrite existing data.

  const ProductionFile = await client.productionFile.findFirst({
    where: { ProFiProductionId: { equals: selectedProdId } },
    select: {
      File: true,
      ProFiId: true,
    },
  });

  if (!ProductionFile) {
    await client.productionFile.create({
      data: {
        ProFiFileId: fileID,
        ProFiProductionId: selectedProdId,
        ProFiFileType: '...',
        ProFiFileDescription: '...',
      },
    });
  }
};

const deleteEvents = async (client: PrismaClient, primaryDateBlockID: number) => {
  // Delete all associated Bookings/Rehearsals/GetInFitUp/Other events for that Primary Date Block
  await deleteAllDateBlockEvents(primaryDateBlockID, client);
};

const updateSpreadsheetDataWithVenueIDs = async (client: PrismaClient, spreadsheetData: SpreadsheetDataCleaned) => {
  // Get VenueIDs for each VenueCode in SpreadsheetData
  const venueCodes = spreadsheetData.venues.map((venue) => venue.venueCode);
  const venueIDs = await client.venue.findMany({
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

  spreadsheetData.venues = spreadsheetData.venues.map((venue) => {
    const matchingVenue = venueIDs.find((v) => v.Code === venue.venueCode);
    return {
      ...venue,
      venueId: matchingVenue ? matchingVenue.Id : null,
    };
  });
};

const createBookings = async (
  client: PrismaClient,
  spreadsheetData: SpreadsheetDataCleaned,
  primaryDateBlockID: number,
) => {
  const bookingsWithSales = [];
  for (const venue of spreadsheetData.venues) {
    for (const booking of venue.bookings) {
      if (venue.venueId) {
        const bookingPromise = createNewBooking(
          {
            DateBlockId: primaryDateBlockID,
            VenueId: venue.venueId,
            Notes: '',
            BookingDate: booking.bookingDate,
            StatusCode: 'C',
            PencilNum: null,
            Performances: [
              {
                Time: null,
                Date: booking.bookingDate,
              },
            ],
            RunTag: nanoid(8),
          },
          client,
        );
        bookingsWithSales.push({ booking: bookingPromise, sales: booking.sales });
      }
    }
  }

  // Wait for all bookings to be created
  const createdBookings = await Promise.allSettled(bookingsWithSales.map((item) => item.booking));

  // Update bookingsWithSales with the resolved bookings
  createdBookings.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      bookingsWithSales[index].booking = result.value;
    } else {
      throw new Error('Error creating bookings for Sales History Data');
    }
  });

  return bookingsWithSales;
};

const createSalesSetWithSales = async (client: PrismaClient, bookingsWithSales) => {
  // Create the sales set and sales for each booking
  for (const { booking, sales } of bookingsWithSales) {
    for (const sale of sales) {
      const setResult = await client.salesSet.create({
        data: {
          SetBookingId: booking.Id,
          SetPerformanceId: null,
          SetSalesFiguresDate: sale.salesDate,
          SetBrochureReleased: false,
          SetSingleSeats: false,
          SetNotOnSale: false,
          SetIsFinalFigures: false,
          SetIsCopy: false,
        },
      });
      const setID = setResult.SetId;
      const salesData = [];

      if (sale.generalSales) {
        salesData.push({
          SaleSaleTypeId: 1,
          SaleSeats: sale.generalSales.seats,
          SaleValue: sale.generalSales.value,
          SaleSetId: setID,
        });
      }
      if (sale.generalReservations) {
        salesData.push({
          SaleSaleTypeId: 2,
          SaleSeats: sale.generalReservations.seats,
          SaleValue: sale.generalReservations.value,
          SaleSetId: setID,
        });
      }
      if (sale.schoolSales) {
        salesData.push({
          SaleSaleTypeId: 3,
          SaleSeats: sale.schoolSales.seats,
          SaleValue: sale.schoolSales.value,
          SaleSetId: setID,
        });
      }
      if (sale.schoolReservations) {
        salesData.push({
          SaleSaleTypeId: 4,
          SaleSeats: sale.schoolReservations.seats,
          SaleValue: sale.schoolReservations.value,
          SaleSetId: setID,
        });
      }
      // Insert sales data
      await client.sale.createMany({
        data: salesData,
      });
    }
  }
};
