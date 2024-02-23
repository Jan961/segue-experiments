import { loggingService } from 'services/loggingService';
import { NextApiRequest, NextApiResponse } from 'next';
import { BookingService } from './services/add.bookings'; // Adjust the import path as needed

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bookingsData = req.body; // Assuming your body is already in the correct format

    const { bookings, performances, rehearsals, getInFitUps, others } =
      await BookingService.createBookings(bookingsData);

    res.status(200).json({ bookings, performances, rehearsals, getInFitUps, others });
  } catch (e) {
    await loggingService.logError(e);
    res.status(500).json({ err: 'Error creating booking' });
  }
}
