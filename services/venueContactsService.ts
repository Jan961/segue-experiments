import getPrismaClient from 'lib/prisma';

export const getContactNotesByBookingId = async (BookingId: number) => {
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
