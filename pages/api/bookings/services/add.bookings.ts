import prisma from 'lib/prisma';
import { AddBookingsParams } from '../interface/add.interface'; // Adjust the import path as needed
import { bookingMapper, performanceMapper, otherMapper, getInFitUpMapper, rehearsalMapper } from 'lib/mappers';

export class BookingService {
  static async createBookings(bookingsData: AddBookingsParams[]) {
    const promises = [];
    const bookings = [];
    let performances = [];
    const rehearsals = [];
    const getInFitUps = [];
    const others = [];

    const orderMap = new Map();
    let counter = 1;

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
          orderMap.set(counter, 'booking');
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
              Notes,
              // VenueId: {
              //   connect: {
              //     Id: VenueId,
              //   },
              // },
              VenueId,
              DateType: {
                connect: {
                  Id: DateTypeId,
                },
              },
            },
          });

          promises.push(rehearsalPromise);
          orderMap.set(counter, 'rehearsal');
        } else if (isGetInFitUp) {
          const getInFitUpPromise = tx.getInFitUp.create({
            data: {
              DateBlock: {
                connect: {
                  Id: DateBlockId,
                },
              },
              StatusCode: BookingStatus,
              Date: new Date(bookingDate),
              Notes,
              Venue: {
                connect: {
                  Id: VenueId,
                },
              },
            },
          });

          promises.push(getInFitUpPromise);
          orderMap.set(counter, 'getInFitUp');
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
              Notes,
              DateType: {
                connect: {
                  Id: DateTypeId,
                },
              },
            },
          });
          promises.push(getOther);
          orderMap.set(counter, 'other');
        }

        counter++;
      }
      counter = 1;
      // const createdItems = await Promise.allSettled(promises);

      // // Processing created items
      // for (const item of createdItems) {
      //   if (item.status === 'fulfilled') {
      //     bookings.push(bookingMapper(item.value));
      //     if (item.value.Performance) {
      //       performances = performances.concat(
      //         item.value.Performance.map((performance) => performanceMapper(performance)),
      //       );
      //     }
      //   }
      // }

      const createdItems = await Promise.allSettled(promises);

      console.log(createdItems);

      for (const item of createdItems) {
        if (item.status === 'fulfilled') {
          const type = orderMap.get(counter);
          counter++;
          console.log('type : ', type);

          const value = item.value;
          // Assuming value contains a property `type` to distinguish between booking, rehearsal, etc.
          // This requires your creation logic to somehow include this information in the result.
          switch (type) {
            case 'booking':
              bookings.push(bookingMapper(value));
              if (value.Performance) {
                performances = performances.concat(value.Performance.map(performanceMapper));
              }
              break;
            case 'rehearsal':
              rehearsals.push(rehearsalMapper(value));
              break;
            case 'getInFitUp':
              getInFitUps.push(getInFitUpMapper(value));
              break;
            case 'other':
              others.push(otherMapper(value));
              break;
            default:
              // Handle any unexpected types
              break;
          }
        } else if (item.status === 'rejected') {
          // Log the error or handle rejected promises as needed
          // console.error(item.reason);
        }
      }

      // Continue with your return or further processing
      // return { bookings, performances, rehearsals, getInFitUps, others };
    });
    return { bookings, performances, rehearsals, getInFitUps, others };
  }
}
