import { loggingService } from 'services/loggingService';
import { NextApiRequest, NextApiResponse } from 'next';
import { BookingService } from './services/add.bookings'; // Adjust the import path as needed
import { mapNewBookingToPrismaFields } from './utils';
import { AddBookingsParams } from './interface/add.interface';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bookingsData = req.body; // Assuming your body is already in the correct format

    let formattedBookings = mapNewBookingToPrismaFields(bookingsData);
    // check if we have run of dates
    const { isRunOfDates } = bookingsData[0];
    if (isRunOfDates) {
      const nonPerformances = formattedBookings.filter(({ isBooking }) => !isBooking);
      let performanceBooking: AddBookingsParams;
      const performances = formattedBookings.filter(({ isBooking }) => isBooking);
      if (performances.length > 0) {
        performanceBooking = performances.reduce((acc, item, index) => {
          if (index > 0) {
            acc.Performances = [...acc.Performances, ...item.Performances];
          }

          return acc;
        }, performances[0]);
      }
      formattedBookings = [...nonPerformances, performanceBooking];
    }
    const { bookings, performances, rehearsals, getInFitUps, others } = await BookingService.createBookings(
      formattedBookings,
      req,
    );

    res.status(200).json({ bookings, performances, rehearsals, getInFitUps, others });
  } catch (e) {
    await loggingService.logError(e);
    res.status(500).json({ err: 'Error creating booking' });
  }
}
