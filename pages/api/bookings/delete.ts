import { deleteBookingById, deleteRehearsalById, deleteGetInFitUpById, deleteOtherById } from 'services/bookingService';
import { NextApiRequest, NextApiResponse } from 'next';
import getPrismaClient from 'lib/prisma';

interface Booking {
  id: number;
  date: string;
  dateAsISOString: string;
  dateBlockId: number;
  dayType: number;
  runTag: string;
  perf: false;
  bookingStatus: string;
  notes: string;
  times: string;
  pencilNo: number;
  isBooking: boolean;
  isRehearsal: boolean;
  isGetInFitUp: boolean;
  isRunOfDates: boolean;
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bookings: Booking[] = req.body;
    const prisma = await getPrismaClient(req);
    await Promise.all(
      bookings
        .filter((obj, index, self) => index === self.findIndex((o) => o.id === obj.id))
        .map(async (booking) => {
          if (booking.isRehearsal) {
            await deleteRehearsalById(booking.id, prisma);
          } else if (booking.isBooking) {
            await deleteBookingById(booking.id, prisma);
          } else if (booking.isGetInFitUp) {
            await deleteGetInFitUpById(booking.id, prisma);
          } else {
            await deleteOtherById(booking.id, prisma);
          }
        }),
    );
    return res.status(200).json('success');
  } catch (e) {
    console.log(e);
    return res.status(500).json({ err: 'Error Deleting Booking' });
  }
}
