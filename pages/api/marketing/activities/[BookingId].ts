import { ActivityDTO } from 'interfaces';
import { activityMapper } from 'lib/mappers';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export type ActivitiesResponse = {
  info: {
    IsOnSale: boolean;
    OnSaleDate: string;
    MarketingPlanReceived: boolean;
    ContactInfoReceived: boolean;
    PrintReqsReceived: boolean;
  };
  activities: ActivityDTO[];
  activityTypes: { Id: number; Name: string }[];
};

let prisma = null;

const getActivitiesByBookingId = async (BookingId) => {
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
      OnSaleDate: info.OnSaleDate ? info.OnSaleDate.toISOString() : '',
    },
  };

  return result;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string);
    prisma = await getPrismaClient(req);

    const result = await getActivitiesByBookingId(BookingId);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}
