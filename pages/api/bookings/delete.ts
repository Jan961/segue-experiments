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
    const deletedIds: number[] = [];
    await Promise.all(
      bookings.map(async (booking) => {
        console.log(deletedIds);
        if (booking.isRehearsal && !deletedIds.includes(booking.id)) {
          deletedIds.push(booking.id);
          await deleteRehearsalById(booking.id, prisma);
        } else if (booking.isBooking && !deletedIds.includes(booking.id)) {
          deletedIds.push(booking.id);
          await deleteBookingById(booking.id, prisma);
        } else if (booking.isGetInFitUp && !deletedIds.includes(booking.id)) {
          deletedIds.push(booking.id);
          await deleteGetInFitUpById(booking.id, prisma);
        } else if (!deletedIds.includes(booking.id)) {
          deletedIds.push(booking.id);
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
