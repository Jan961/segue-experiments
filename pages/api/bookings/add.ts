import { loggingService } from 'services/loggingService';
import { NextApiRequest, NextApiResponse } from 'next';
import { BookingService } from './services/add.bookings'; // Adjust the import path as needed
import { BookingItem } from 'components/bookings/modal/NewBooking/reducer';

const mapToPrismaFields = (values: BookingItem[] = []) => {
  console.log('mapToPrismaFields', values);
  const mapped = values
    .filter((item) => item.dayType !== null && item.bookingStatus !== null)
    .map((item) => {
      const mappedItem = {
        DateBlockId: Number(item.dateBlockId),
        VenueId: item.venue,
        Date: item.dateAsISOString,
        DateTypeId: item.dayType,
        performanceTimes: item.times ? item.times.split(',') : [],
        BookingStatus: item.bookingStatus,
        PencilNo: Number(item.pencilNo),
        Notes: item.notes,
        isBooking: item.isBooking || item.perf,
        isRehearsal: item.isRehearsal,
        isGetInFitUp: item.isGetInFitUp,
      };
      return mappedItem;
    });
  return mapped;
};

export interface AddBookingsParams {
  Date: string;
  DateBlockId: number;
  VenueId: number;
  performanceTimes: string[];
  DateTypeId: number;
  BookingStatus: string;
  PencilNo: number;
  Notes: string;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bookingsData = req.body; // Assuming your body is already in the correct format
    const formattedBookings = mapToPrismaFields(bookingsData);
    const { bookings, performances, rehearsals, getInFitUps, others } =
      await BookingService.createBookings(formattedBookings);

    res.status(200).json({ bookings, performances, rehearsals, getInFitUps, others });
  } catch (e) {
    await loggingService.logError(e);
    res.status(500).json({ err: 'Error creating booking' });
  }
}
