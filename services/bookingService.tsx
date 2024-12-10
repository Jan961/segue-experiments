import { Booking, GetInFitUp, Other, Prisma, Rehearsal } from 'prisma/generated/prisma-client';
import { addDays, differenceInDays } from 'date-fns';
import { omit } from 'radash';
import { isNullOrEmpty } from 'utils';
import { checkDateValid, getPerformanceTime } from 'utils/getTimeFromDateTime';
import { NextApiRequest } from 'next';
import getPrismaClient from 'lib/prisma';
import { activityMapper } from 'lib/mappers';
import { newDate } from './dateService';

export type NewPerformance = {
  Date: string;
  Time: string;
};

export type EnrichedBooking = Partial<Booking> & {
  Performances: NewPerformance[];
  BookingDate: string;
  RunTag: string;
};

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
  DateBlock: true,
  _count: true,
});

export type BookingsWithPerformances = Prisma.BookingGetPayload<{
  include: typeof bookingInclude;
}>;

export const updateBooking = async (booking: EnrichedBooking, tx) => {
  let updatedBooking = null;
  let updatedPerformances = null;
  const payload = {
    ...omit(booking, ['Id', 'VenueId', 'Performances', 'DateBlockId']),
    ...(booking.VenueId && { Venue: { connect: { Id: booking.VenueId } } }),
    ...(booking.DateBlockId && { DateBlock: { connect: { Id: booking.DateBlockId } } }),
    Performance: {
      deleteMany: {
        BookingId: booking.Id,
      },
    },
  };
  try {
    updatedBooking = await tx.booking.update({
      where: {
        Id: booking.Id,
      },
      data: payload,
      include: bookingInclude,
    });

    if (isNullOrEmpty(booking.Performances)) {
      updatedPerformances = await tx.performance.create({
        data: { BookingId: booking.Id, Date: booking.FirstDate, Time: null },
      });
    } else {
      updatedPerformances = await tx.performance.createMany({
        data: booking.Performances.map((p: NewPerformance) => ({
          BookingId: booking.Id,
          Date: newDate(p.Date),
          Time: getPerformanceTime(p),
        })),
      });
    }
    return { ...updatedBooking, ...updatedPerformances };
  } catch (e) {
    console.log('Error in booking service', e);
    throw e;
  }
};

export const updateGetInFitUp = async (booking: GetInFitUp, tx) => {
  const payload = {
    ...omit(booking, ['Id', 'VenueId', 'DateBlockId']),
    ...(booking.VenueId && { Venue: { connect: { Id: booking.VenueId } } }),
    ...(booking.DateBlockId && { DateBlock: { connect: { Id: booking.DateBlockId } } }),
  };

  await tx.getInFitUp.update({
    data: payload,
    where: {
      Id: booking.Id,
    },
  });
};

export const updateRehearsal = async (booking: Rehearsal, tx) => {
  await tx.rehearsal.update({
    data: {
      ...omit(booking, ['Id', 'DateBlockId']),
      ...(booking.DateBlockId && { DateBlock: { connect: { Id: booking.DateBlockId } } }),
    },
    where: {
      Id: booking.Id,
    },
  });
};

export const updateOther = async (booking: Other, tx) => {
  await tx.other.update({
    data: {
      ...omit(booking, ['Id', 'DateBlockId', 'DateTypeId']),
      ...(booking.DateBlockId && { DateBlock: { connect: { Id: booking.DateBlockId } } }),
      ...(booking.DateTypeId && { DateType: { connect: { Id: booking.DateTypeId } } }),
    },
    where: {
      Id: booking.Id,
    },
  });
};

export const deleteBookingById = async (id: number, tx) => {
  await tx.booking.delete({
    where: {
      Id: id,
    },
  });
  await tx.performance.deleteMany({
    where: {
      BookingId: id,
    },
  });
};

export const deletePerformancesForBooking = async (id: number, tx) => {
  await tx.performance.delete({
    where: {
      BookingId: id,
    },
  });
};

export const deleteRehearsalById = async (id: number, tx) => {
  await tx.rehearsal.delete({
    where: {
      Id: id,
    },
  });
};

export const deleteGetInFitUpById = async (id: number, tx) => {
  await tx.getInFitUp.delete({
    where: {
      Id: id,
    },
  });
};

export const deleteOtherById = async (id: number, tx) => {
  await tx.other.delete({
    where: {
      Id: id,
    },
  });
};

export const createBooking = (VenueId: number, FirstDate: Date, DateBlockId: number, prisma) => {
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

export const getSaleableBookings = async (ProductionId: number, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
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
      _count: {
        select: {
          Performance: true,
        },
      },
    },
    orderBy: {
      FirstDate: 'asc',
    },
  });
};

export const changeBookingDate = async (Id: number, FirstDate: Date, prisma) => {
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

export const createNewBooking = (
  { Performances, VenueId, DateBlockId, BookingDate, StatusCode, Notes, PencilNum, RunTag }: EnrichedBooking,
  tx,
) => {
  const performanceData = Performances.map((p: NewPerformance) => {
    return {
      Date: newDate(p.Date),
      Time: checkDateValid(getPerformanceTime(p)),
    };
  });
  return tx.booking.create({
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
          data: performanceData,
        },
      },

      HasSchoolsSales: true,
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
  tx,
) => {
  return tx.rehearsal.create({
    data: {
      Notes,
      StatusCode,
      RunTag,
      PencilNum,
      Date: newDate(BookingDate),
      DateBlock: {
        connect: {
          Id: DateBlockId,
        },
      },
      ...(VenueId && { Venue: { connect: { Id: VenueId } } }),
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
  tx,
) => {
  return tx.getInFitUp.create({
    data: {
      StatusCode,
      Notes,
      PencilNum,
      RunTag,
      Date: newDate(BookingDate),
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
  tx,
) => {
  return tx.other.create({
    data: {
      Notes,
      StatusCode,
      PencilNum,
      RunTag,
      Date: newDate(BookingDate),
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

export const getActivitiesByBookingId = async (BookingId, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  const activityTypes = await prisma.activityType.findMany({
    select: {
      Name: true,
      Id: true,
    },
    orderBy: {
      Name: 'asc',
    },
  });

  const info = await prisma.booking.findUnique({
    where: {
      Id: BookingId,
    },
    select: {
      TicketsOnSale: true,
      TicketsOnSaleFromDate: true,
      MarketingPlanReceived: true,
      ContactInfoReceived: true,
      PrintReqsReceived: true,
    },
  });

  const activities = await prisma.bookingActivity.findMany({
    where: {
      BookingId,
    },
    orderBy: {
      Date: 'asc',
    },
  });

  const result = {
    activityTypes,
    activities: activities.map(activityMapper),
    info: {
      ...info,
      OnSaleDate: info.TicketsOnSaleFromDate ? info.TicketsOnSaleFromDate.toISOString() : '',
    },
  };

  return result;
};
