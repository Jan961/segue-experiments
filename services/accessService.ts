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

// No need for access check based on the second paramater. This method needs to be refactored
// console log left on purpose to avoid ESLint errors
export const checkAccess = async (email: string, items: AccessCheck = null): Promise<boolean> => {
  console.log(items);
  const user = await prisma.user.findUnique({
    where: {
      Email: email,
    },
  });

  return !!user;
};
