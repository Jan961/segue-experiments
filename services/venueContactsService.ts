import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';

export const getContactNotesByBookingId = async (BookingId: number, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  const data = await prisma.bookingContactNotes.findMany({
    where: {
      BookingId,
    },
    orderBy: {
      ContactDate: 'desc',
    },
  });
  return data;
};
