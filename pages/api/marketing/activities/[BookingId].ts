import { ActivityDTO } from 'interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { getActivitiesByBookingId } from 'services/bookingService';

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

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string);
    const result = await getActivitiesByBookingId(BookingId, req);

    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred while generating search results.' });
  }
}
