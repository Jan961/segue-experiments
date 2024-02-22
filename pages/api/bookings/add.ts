import { bookingMapper, performanceMapper } from 'lib/mappers';
import prisma from 'lib/prisma';
import { loggingService } from 'services/loggingService';

export interface AddBookingsParams {
  Date: string;
  DateBlockId: number;
  VenueId: number;
  performanceTimes: string[];
  DateTypeId?: number;
  BookingStatus: string;
  PencilNo: number;
  Notes: string;
  isBooking?: boolean;
  isRehearsal?: boolean;
  isGetInFitUp?: boolean;
  // Add any additional fields needed for rehearsals and getInFitUp
}

export default async function handle(req, res) {
  try {
    const BookingsData = req.body as AddBookingsParams[];

    const promises = [];
    const bookings = [];
    let performances = [];
    await prisma.$transaction(async (tx) => {
      for (const BookingData of BookingsData) {
        const {
          DateBlockId,
          VenueId,
          Date: bookingDate,
          performanceTimes = [],
          BookingStatus,
          PencilNo,
          Notes,
          isBooking = true,
          isRehearsal,
          isGetInFitUp,
          DateTypeId,
        } = BookingData || {};

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
      return createdItems;
    });
    res.status(200).json({ bookings, performances });
  } catch (e) {
    await loggingService.logError(e);
    res.status(500).json({ err: 'Error creating booking' });
  }
}
