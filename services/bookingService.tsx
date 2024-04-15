import { Booking, GetInFitUp, Other, Prisma, Rehearsal } from '@prisma/client';
import { addDays, differenceInDays } from 'date-fns';
import prisma from 'lib/prisma';
import { omit } from 'radash';
import { isNullOrEmpty } from 'utils';
import { bookingMapper, performanceMapper, otherMapper, getInFitUpMapper, rehearsalMapper } from 'lib/mappers';

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
  RunTag: string;
  // Add any additional fields needed for rehearsals and getInFitUp
}

const bookingInclude = Prisma.validator<Prisma.BookingInclude>()({
  Venue: true,
  Performance: true,
});

export type BookingsWithPerformances = Prisma.BookingGetPayload<{
  include: typeof bookingInclude;
}>;

export const updateBooking = async (booking: Booking, performances) => {
  let updatedBooking = null;
  let updatedPerformances = null;
  await prisma.$transaction(async (tx) => {
    updatedBooking = await tx.booking.update({
      where: {
        Id: booking.Id,
      },
      data: {
        ...booking,
        Performance: {
          deleteMany: {
            BookingId: booking.Id,
          },
        },
      },
      include: bookingInclude,
    });

    if (isNullOrEmpty(performances)) {
      updatedPerformances = await tx.performance.create({
        data: { BookingId: booking.Id, Date: booking.FirstDate, Time: null },
      });
    } else {
      updatedPerformances = await tx.performance.createMany({
        data: performances.map((time) => ({ BookingId: booking.Id, Date: time, Time: time })),
      });
    }
  });
  return { ...updatedBooking, ...updatedPerformances };
};

export const updateGetInFitUp = async (booking: GetInFitUp) => {
  await prisma.getInFitUp.update({
    data: omit(booking, ['Id']),
    where: {
      Id: booking.Id,
    },
  });
};

export const updateRehearsal = async (booking: Rehearsal) => {
  await prisma.rehearsal.update({
    data: omit(booking, ['Id']),
    where: {
      Id: booking.Id,
    },
  });
};

export const updateOther = async (booking: Other) => {
  await prisma.other.update({
    data: omit(booking, ['Id']),
    where: {
      Id: booking.Id,
    },
  });
};

export const deleteBookingById = async (id: number) => {
  await prisma.$transaction([
    prisma.booking.delete({
      where: {
        Id: id,
      },
    }),
    prisma.performance.deleteMany({
      where: {
        BookingId: id,
      },
    }),
  ]);
};

export const deleteRehearsalById = async (id: number) => {
  await prisma.rehearsal.delete({
    where: {
      Id: id,
    },
  });
};

export const deleteGetInFitUpById = async (id: number) => {
  await prisma.getInFitUp.delete({
    where: {
      Id: id,
    },
  });
};

export const deleteOtherById = async (id: number) => {
  await prisma.other.delete({
    where: {
      Id: id,
    },
  });
};

export const createBooking = (VenueId: number, FirstDate: Date, DateBlockId: number) => {
  return prisma.booking.create({
    data: {
      FirstDate,
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
    include: bookingInclude,
  });
};

export const getSaleableBookings = async (ProductionId: number) => {
  return await prisma.booking.findMany({
    where: {
      DateBlock: {
        is: {
          ProductionId,
          Name: 'Production',
        },
      },
      VenueId: {
        not: undefined,
      },
    },
    include: {
      Venue: true,
      DateBlock: {
        include: {
          Production: {
            include: {
              Show: true,
            },
          },
        },
      },
    },
    orderBy: {
      FirstDate: 'asc',
    },
  });
};

export const changeBookingDate = async (Id: number, FirstDate: Date) => {
  const booking = await prisma.booking.findUnique({
    where: {
      Id,
    },
    include: {
      Performance: true,
    },
  });

  const daysDiff = differenceInDays(FirstDate, booking.FirstDate);

  await prisma.$transaction(async (tx) => {
    for (const perf of booking.Performance) {
      await tx.performance.update({
        where: {
          Id: perf.Id,
        },
        data: {
          Date: addDays(perf.Date, daysDiff),
        },
      });
    }

    await prisma.booking.update({
      where: {
        Id,
      },
      data: {
        FirstDate,
      },
    });
  });

  // Return new booking for client side update
  return prisma.booking.findUnique({
    where: {
      Id,
    },
    include: {
      Performance: true,
    },
  });
};

type NewPerformance = {
  Date: string;
  Time: string;
};

type NewBooking = Partial<Booking> & { Performances: NewPerformance[]; BookingDate: string; RunTag: string };

export const createNewBooking = (
  { Performances, VenueId, DateBlockId, BookingDate, StatusCode, Notes, PencilNum, RunTag }: NewBooking,
  tx: any,
) => {
  return (tx || prisma).booking.create({
    data: {
      Notes,
      PencilNum,
      StatusCode,
      RunTag,
      FirstDate: new Date(BookingDate),
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
          data: Performances.map((p: NewPerformance) => ({
            Date: new Date(p.Date),
            Time: p.Time ? new Date(p.Time) : null,
          })),
        },
      },
    },
    include: {
      Performance: true,
      Venue: true,
    },
  });
};

type NewRehearsal = {
  DateBlockId: number;
  StatusCode: string;
  BookingDate: string;
  Notes: string;
  VenueId: number;
  DateTypeId: number;
  PencilNum: number;
  RunTag: string;
};

export const createNewRehearsal = (
  { DateBlockId, StatusCode, BookingDate, Notes, VenueId, PencilNum, RunTag }: NewRehearsal,
  tx: any,
) => {
  return (tx || prisma).rehearsal.create({
    data: {
      Notes,
      StatusCode,
      RunTag,
      PencilNum,
      Date: new Date(BookingDate),
      DateBlock: {
        connect: {
          Id: DateBlockId,
        },
      },
      ...(VenueId && { VenueId }),
    },
  });
};

type NewGetInFitUp = {
  DateBlockId: number;
  StatusCode: string;
  BookingDate: string;
  Notes: string;
  VenueId: number;
  PencilNum: number;
  RunTag: string;
};

export const createGetInFitUp = (
  { DateBlockId, StatusCode, BookingDate, Notes, VenueId, PencilNum, RunTag }: NewGetInFitUp,
  tx: any,
) => {
  return (tx || prisma).getInFitUp.create({
    data: {
      StatusCode,
      Notes,
      PencilNum,
      RunTag,
      Date: new Date(BookingDate),
      DateBlock: {
        connect: {
          Id: DateBlockId,
        },
      },
      ...(VenueId && { Venue: { connect: { Id: VenueId } } }),
    },
  });
};

type NewOtherBooking = {
  DateBlockId: number;
  BookingDate: string;
  StatusCode: string;
  Notes: string;
  DateTypeId: number;
  PencilNum: number;
  RunTag: string;
};

export const createOtherBooking = (
  { DateBlockId, BookingDate, StatusCode, Notes, DateTypeId, PencilNum, RunTag }: NewOtherBooking,
  tx: any,
) => {
  return (tx || prisma).other.create({
    data: {
      Notes,
      StatusCode,
      PencilNum,
      RunTag,
      Date: new Date(BookingDate),
      DateBlock: {
        connect: {
          Id: DateBlockId,
        },
      },
      DateType: {
        connect: {
          Id: DateTypeId,
        },
      },
    },
  });
};

export const createMultipleBookings = async (bookingsData: AddBookingsParams[]) => {
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
        Date: BookingDate,
        performanceTimes = [],
        BookingStatus: StatusCode,
        PencilNo: PencilNum,
        Notes,
        isBooking,
        isRehearsal,
        isGetInFitUp,
        DateTypeId,
        RunTag,
      } = bookingData || {};

      if (isBooking) {
        const Performances =
          performanceTimes.length > 0
            ? performanceTimes.map((time) => {
                const datePart = BookingDate.split('T')[0];
                return {
                  Time: `${datePart}T${time}:00Z`,
                  Date: BookingDate,
                };
              })
            : [
                {
                  Time: null,
                  Date: BookingDate,
                },
              ];

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

    console.log(createdItems);

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
};
