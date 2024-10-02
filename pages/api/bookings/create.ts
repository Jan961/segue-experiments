import { bookingMapper } from 'lib/mappers';
import getPrismaClient from 'lib/prisma';
import { createBooking } from 'services/bookingService';
import { loggingService } from 'services/loggingService';

export interface CreateBookingsParams {
  Date: string;
  DateBlockId: number;
  VenueId: number;
}

export default async function handle(req, res) {
  try {
    const data = req.body as CreateBookingsParams;
    const { DateBlockId, VenueId } = data;
    const prisma = await getPrismaClient(req);
    const created = await createBooking(VenueId, new Date(data.Date), DateBlockId, prisma);
    res.status(200).json(bookingMapper(created));
  } catch (e) {
    console.log(e);
    await loggingService.logError(e);
    res.status(500).json({ err: 'Error creating booking' });
  }
}
