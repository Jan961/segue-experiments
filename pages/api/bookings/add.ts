import { bookingMapper, performanceMapper } from 'lib/mappers';
import prisma from 'lib/prisma';
import { loggingService } from 'services/loggingService';

export interface AddBookingsParams {
  Date: string;
  DateBlockId: number;
  VenueId: number;
  performanceTimes: string[];
  DateTypeId: number;
  BookingStatus: string;
  PencilNo: number;
  Notes: string;
}

export default async function handle(req, res) {
  try {
    const dateTypes = await prisma.DateType.findMany();

    console.log(dateTypes);

    const BookingsData = req.body as AddBookingsParams[];
    // console.log('BookingsData : ', BookingsData);

    const promises = [];
    const bookings = [];
    let performances = [];
    await prisma.$transaction(async (tx) => {
      for (const BookingData of BookingsData) {
        // console.log('Inside for loop : ', BookingData);

        const {
          DateBlockId,
          VenueId,
          Date: bookingDate,
          performanceTimes = [],
          BookingStatus,
          PencilNo,
          Notes,
        } = BookingData || {};
        const performances = performanceTimes.map((time) => ({
          create: {
            Time: new Date(`${bookingDate}T${time}`),
            Date: new Date(bookingDate),
          },
        }));
        const created = tx.booking.create({
          data: {
            FirstDate: new Date(bookingDate),
            DateBlock: {
              connect: {
                Id: DateBlockId,
              },
            },
            Venue: {
              connect: {
                Id: VenueId,
              },
            },
            Performance: {
              createMany: {
                data: performances.map((p) => p.create),
              },
            },
            StatusCode: BookingStatus,
            PencilNum: PencilNo,
            Notes,
          },
          include: {
            Performance: true,
            Venue: true,
          },
        });
        // console.log(created);

        promises.push(created);
        console.log('promises : ', promises);
      }
      const createdBookings = await Promise.allSettled(promises);
      for (const createdBooking of createdBookings) {
        // console.log('Inside promises : ', createdBooking);

        if (createdBooking.status === 'fulfilled') {
          bookings.push(bookingMapper(createdBooking.value));
          performances = performances.concat(
            createdBooking.value.Performance.map((performance) => performanceMapper(performance)),
          );
        }
      }
      return createdBookings;
    });
    res.status(200).json({ bookings, performances });
  } catch (e) {
    await loggingService.logError(e);
    res.status(500).json({ err: 'Error creating booking' });
  }
}

// my changes

// export default async function handle1(req, res) {
//   try {
//     const dateTypes = await prisma.DateType.findMany();

//     // Dynamically find DateTypeIds based on their names
//     const bookingTypeId = dateTypes.find((dt) => dt.DateTypeName === 'Booking')?.Id;
//     const getInFitUpTypeId = dateTypes.find((dt) => dt.DateTypeName === 'getInFitUp')?.Id;
//     // Add any other types you need to handle specifically

//     const BookingsData = req.body as AddBookingsParams[];

//     const promises = [];
//     const bookings = [];
//     let performances = [];

//     await prisma.$transaction(async (tx) => {
//       for (const BookingData of BookingsData) {
//         if (BookingData.DateTypeId === bookingTypeId) {
//           // Your existing logic for creating bookings
//         } else if (BookingData.DateTypeId === getInFitUpTypeId) {
//           // Handle "getInFitUp" specifically, if needed
//         } else {
//           // For all other types, you might want to store them differently
//           // Assuming you have an 'Other' model for these cases
//           const otherPromise = tx.other.create({
//             data: {
//               // Adapt this to match your 'Other' model's schema
//               Date: new Date(BookingData.Date),
//               Notes: BookingData.Notes,
//               DateTypeId: BookingData.DateTypeId,
//               // Include other necessary fields from BookingData
//             },
//           });
//           promises.push(otherPromise);
//         }
//       }

//       const results = await Promise.allSettled(promises);
//       // Process results here...
//     });

//     res.status(200).json({ bookings, performances });
//   } catch (e) {
//     await loggingService.logError(e);
//     res.status(500).json({ err: 'Error creating booking or handling specific types' });
//   }
// }
