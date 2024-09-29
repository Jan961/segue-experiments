import getPrismaClient from 'lib/prisma';
import { AddBookingsParams } from '../interface/add.interface'; // Adjust the import path as needed
import { bookingMapper, performanceMapper, otherMapper, getInFitUpMapper, rehearsalMapper } from 'lib/mappers';
import { createGetInFitUp, createNewBooking, createNewRehearsal, createOtherBooking } from 'services/bookingService';
import { NextApiRequest } from 'next';

export class BookingService {
  static async createBookings(bookingsData: AddBookingsParams[], req: NextApiRequest) {
    const promises = [];
    const bookings = [];
    let performances = [];
    const rehearsals = [];
    const getInFitUps = [];
    const others = [];

    const orderMap = new Map();
    let counter = 1;
    const prisma = await getPrismaClient(req);
    await prisma.$transaction(async (tx) => {
      for (const bookingData of bookingsData) {
        const {
          DateBlockId,
          VenueId,
          BookingDate,
          Performances,
          StatusCode,
          PencilNum,
          Notes,
          isBooking,
          isRehearsal,
          isGetInFitUp,
          DateTypeId,
          RunTag,
        } = bookingData || {};

        if (isBooking) {
          const bookingPromise = createNewBooking(
            {
              DateBlockId,
              PencilNum,
              Notes,
              VenueId,
              Performances,
              BookingDate,
              StatusCode,
              RunTag,
            },
            tx,
          );
          promises.push(bookingPromise);
          orderMap.set(counter, 'booking');
        } else if (isRehearsal) {
          const rehearsalPromise = createNewRehearsal(
            {
              DateBlockId,
              Notes,
              DateTypeId,
              VenueId,
              StatusCode,
              BookingDate,
              PencilNum,
              RunTag,
            },
            tx,
          );
          promises.push(rehearsalPromise);
          orderMap.set(counter, 'rehearsal');
        } else if (isGetInFitUp) {
          const getInFitUpPromise = createGetInFitUp(
            {
              DateBlockId,
              VenueId,
              Notes,
              BookingDate,
              StatusCode,
              PencilNum,
              RunTag,
            },
            tx,
          );

          promises.push(getInFitUpPromise);
          orderMap.set(counter, 'getInFitUp');
        } else {
          const getOther = createOtherBooking(
            {
              DateBlockId,
              DateTypeId,
              Notes,
              BookingDate,
              StatusCode,
              PencilNum,
              RunTag,
            },
            tx,
          );
          promises.push(getOther);
          orderMap.set(counter, 'other');
        }
        counter++;
      }
      counter = 1;

      const createdItems = await Promise.allSettled(promises);

      for (const item of createdItems) {
        if (item.status === 'fulfilled') {
          const type = orderMap.get(counter);
          counter++;

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
