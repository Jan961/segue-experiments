import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import { SpreadsheetDataCleaned } from 'types/SpreadsheetValidationTypes';
import { getDateBlockForProduction, deleteAllDateBlockEvents } from 'services/dateBlockService';
import { nanoid } from 'nanoid';
import { createNewBooking } from 'services/bookingService';

interface RequestBody {
  spreadsheetData: SpreadsheetDataCleaned;
  productionID: number;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { spreadsheetData, productionID }: RequestBody = req.body;

    const result = await prisma.$transaction(async (tx) => {
      try {
        // Find DateBlock for ProductionID that isPrimary
        const primaryDateBlock = await getDateBlockForProduction(productionID, true);
        const primaryDateBlockID = primaryDateBlock[0].Id;

        // Delete all associated Bookings/Rehearsals/GetInFitUp/Other events for that Primary Date Block
        await deleteAllDateBlockEvents(primaryDateBlockID, tx);

        // Get VenueIDs for each VenueCode in SpreadsheetData
        const venueCodes = spreadsheetData.venues.map((venue) => venue.venueCode);
        const venueIDs = await tx.venue.findMany({
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
                tx,
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

        // Create the sales set and sales for each booking
        for (const { booking, sales } of bookingsWithSales) {
          for (const sale of sales) {
            const setResult = await tx.salesSet.create({
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
            await tx.sale.createMany({
              data: salesData,
            });
          }
        }

        return 'Success';
      } catch (error) {
        console.log(error, 'Error occurred in transaction whilst creating ProductionFile');
        return 'Failed';
      }
    });

    res.status(200).json({ status: result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error Creating Production File' });
  }
}
