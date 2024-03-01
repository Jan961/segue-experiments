import { Booking, Prisma } from '@prisma/client';
import { addDays, differenceInDays } from 'date-fns';
import prisma from 'lib/prisma';
import { omit } from 'radash';

export const updateBookingVenue = (date, venueID, productionID) => {
  fetch(`/api/productions/booking/update/${productionID}/${venueID}/${date}`).then((res) => res.json());
  return true;
};

const bookingInclude = Prisma.validator<Prisma.BookingInclude>()({
  Venue: true,
  Performance: true,
});

export type BookingsWithPerformances = Prisma.BookingGetPayload<{
  include: typeof bookingInclude;
}>;

export const updateBooking = async (booking: Booking) => {
  return prisma.booking.update({
    where: {
      Id: booking.Id,
    },
    data: omit(booking, ['Id']),
    include: bookingInclude,
  });
};

export const deleteBookingById = async (BookingId: any) => {
  await prisma.$transaction([
    prisma.booking.delete({
      where: {
        Id: BookingId,
      },
    }),
    prisma.performance.deleteMany({
      where: {
        BookingId,
      },
    }),
  ]);
};

export const createBooking = (VenueId: number, FirstDate: Date, DateBlockId: number) => {
  console.log(FirstDate);

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

  console.log(`Moving booking by ${daysDiff} day(s)`);

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

type NewBooking = Partial<Booking> & { Performances: NewPerformance[]; BookingDate: string };

export const createNewBooking = (
  { Performances, VenueId, DateBlockId, BookingDate, StatusCode, Notes, PencilNum }: NewBooking,
  tx: any,
) => {
  return (tx || prisma).booking.create({
    data: {
      Notes,
      PencilNum,
      StatusCode,
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
            Time: new Date(p.Time),
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
};

export const createNewRehearsal = (
  { DateBlockId, StatusCode, BookingDate, Notes, VenueId, DateTypeId }: NewRehearsal,
  tx: any,
) => {
  return (tx || prisma).rehearsal.create({
    data: {
      Notes,
      StatusCode,
      Date: new Date(BookingDate),
      DateBlock: {
        connect: {
          Id: DateBlockId,
        },
      },
      // Venue: {
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
};

type NewGetInFitUp = {
  DateBlockId: number;
  StatusCode: string;
  BookingDate: string;
  Notes: string;
  VenueId: number;
};

export const createGetInFitUp = ({ DateBlockId, StatusCode, BookingDate, Notes, VenueId }: NewGetInFitUp, tx: any) => {
  return (tx || prisma).getInFitUp.create({
    data: {
      StatusCode,
      Notes,
      Date: new Date(BookingDate),
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
};

type NewOtherBooking = {
  DateBlockId: number;
  BookingDate: string;
  StatusCode: string;
  Notes: string;
  DateTypeId: number;
};

export const createOtherBooking = (
  { DateBlockId, BookingDate, StatusCode, Notes, DateTypeId }: NewOtherBooking,
  tx: any,
) => {
  return (tx || prisma).other.create({
    data: {
      Notes,
      StatusCode,
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
