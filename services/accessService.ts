import prisma from 'lib/prisma';

// This may need to be expanded to include Tasks, Contracts, Files
export interface AccessCheck {
  ShowId?: number;
  ProductionId?: number;
  AccountId?: number;
  DateBlockId?: number;
  BookingId?: number;
  OtherId?: number;
  GifuId?: number;
  PerformanceId?: number;
  RehearsalId?: number;
  ActivityId?: number;
  AvailableCompId?: number;
  TaskId?: number;
}

// Check access based on the second paramater. Can pass multiple to it if wanted (but will increase workload)
// POTENTIAL BOTTLENECK: All API calls and page renders should come through here, unless the result of an AccountId lookup
// Adding a console log with timer here would be very useful for debug purposes.
export const checkAccess = async (email: string, items: AccessCheck): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: {
      Email: email,
    },
  });

  if (!user) return false;

  // We just need the minimal for checking existence
  const select = {
    Id: true,
  };

  // We default to true for simple user checks
  const successes = [true];

  // Show
  if (items.ShowId) {
    const show = await prisma.show.findFirst({
      where: {
        Id: items.ShowId,
        AccountId: user.AccountId,
      },
      select,
    });
    successes.push(!!show);
  }

  // Production
  if (items.ProductionId) {
    const production = await prisma.production.findFirst({
      where: {
        Id: items.ProductionId,
        Show: {
          is: {
            AccountId: user.AccountId,
          },
        },
      },
      select,
    });

    successes.push(!!production);
  }

  // DateBlock
  if (items.DateBlockId) {
    const dateblock = await prisma.dateBlock.findFirst({
      where: {
        Id: items.DateBlockId,
        Production: {
          is: {
            Show: {
              is: {
                AccountId: user.AccountId,
              },
            },
          },
        },
      },
      select,
    });
    successes.push(!!dateblock);
  }

  // Shared for all event types, gifu, booking, rehearsal etc.
  const EventWhere = {
    DateBlock: {
      is: {
        Production: {
          is: {
            Show: {
              is: {
                AccountId: user.AccountId,
              },
            },
          },
        },
      },
    },
  };

  // Booking
  if (items.BookingId) {
    const booking = await prisma.booking.findFirst({
      where: {
        Id: items.BookingId,
        ...EventWhere,
      },
      select,
    });
    successes.push(!!booking);
  }

  // Rehearsal
  if (items.RehearsalId) {
    const rehearsal = await prisma.rehearsal.findFirst({
      where: {
        Id: items.RehearsalId,
        ...EventWhere,
      },
      select,
    });

    successes.push(!!rehearsal);
  }

  // Get In Fit Up (GIFU)
  if (items.GifuId) {
    const gifu = await prisma.getInFitUp.findFirst({
      where: {
        Id: items.GifuId,
        ...EventWhere,
      },
      select,
    });

    successes.push(!!gifu);
  }

  // Other
  if (items.OtherId) {
    const other = await prisma.other.findFirst({
      where: {
        Id: items.OtherId,
        ...EventWhere,
      },
      select,
    });
    successes.push(!!other);
  }

  // Performance
  if (items.PerformanceId) {
    const perf = await prisma.performance.findFirst({
      where: {
        Id: items.PerformanceId,
        // Slightly different. This is based on booking
        Booking: {
          is: EventWhere,
        },
      },
      select,
    });

    successes.push(!!perf);
  }

  // Performance
  if (items.ActivityId) {
    const bookingActivity = await prisma.bookingActivity.findFirst({
      where: {
        Id: items.ActivityId,
        // Slightly different. This is based on booking
        Booking: {
          is: EventWhere,
        },
      },
      select,
    });

    successes.push(!!bookingActivity);
  }

  if (items.AvailableCompId) {
    const availableComp = await prisma.availableComp.findFirst({
      where: {
        Id: items.AvailableCompId,
        // Slightly different. This is based on booking
        Performance: {
          is: {
            Booking: {
              is: EventWhere,
            },
          },
        },
      },
      select,
    });

    successes.push(!!availableComp);
  }

  if (items.TaskId) {
    const task = await prisma.productionTask.findFirst({
      where: {
        Id: items.TaskId,
        // Slightly different. This is based on booking
        Production: EventWhere.DateBlock.is.Production,
      },
      select,
    });

    successes.push(!!task);
  }

  return successes.filter((x) => !x).length === 0;
};
