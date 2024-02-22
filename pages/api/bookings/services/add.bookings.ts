import prisma from 'lib/prisma';
import { AddBookingsParams } from '../interface/add.interface'; // Adjust the import path as needed
import { bookingMapper, performanceMapper } from 'lib/mappers';

export class BookingService {
  static async createBookings(bookingsData: AddBookingsParams[]) {
    const promises = [];
    const bookings = [];
    let performances = [];

    await prisma.$transaction(async (tx) => {
      for (const bookingData of bookingsData) {
        const {
          DateBlockId,
          VenueId,
          Date: bookingDate,
          performanceTimes = [],
          BookingStatus,
          PencilNo,
          Notes,
          isBooking,
          isRehearsal,
          isGetInFitUp,
          DateTypeId,
        } = bookingData || {};

        if (isBooking) {
          const performancesData = performanceTimes.map((time) => ({
            create: {
              Time: new Date(`${bookingDate}T${time}`),
              Date: new Date(bookingDate),
            },
          }));

          const bookingPromise = tx.booking.create({
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
                  data: performancesData.map((p) => p.create),
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

          promises.push(bookingPromise);
        } else if (isRehearsal) {
          const rehearsalPromise = tx.rehearsal.create({
            data: {
              DateBlock: {
                connect: {
                  Id: DateBlockId,
                },
              },
              StatusCode: BookingStatus,
              Date: new Date(bookingDate),
              DateType: {
                connect: {
                  Id: DateTypeId,
                },
              },
            },
          });

          promises.push(rehearsalPromise);
        } else if (isGetInFitUp) {
          const getInFitUpPromise = tx.getInFitUp.create({
            data: {
              Date: new Date(bookingDate),
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
            },
          });

          promises.push(getInFitUpPromise);
        } else {
          const getOther = tx.other.create({
            data: {
              DateBlock: {
                connect: {
                  Id: DateBlockId,
                },
              },
              StatusCode: BookingStatus,
              Date: new Date(bookingDate),
              DateType: {
                connect: {
                  Id: DateTypeId,
                },
              },
            },
          });
          promises.push(getOther);
        }
      }
      const createdItems = await Promise.allSettled(promises);

      // Processing created items
      for (const item of createdItems) {
        if (item.status === 'fulfilled') {
          bookings.push(bookingMapper(item.value));
          if (item.value.Performance) {
            performances = performances.concat(
              item.value.Performance.map((performance) => performanceMapper(performance)),
            );
          }
        }
      }
    });

    return { bookings, performances };
  }
}
