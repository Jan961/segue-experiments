import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAccess, getEmailFromReq } from 'services/userService';

const mapToPrisma = (fields) => {
  return {
    LandingPageURL: fields.landingPageUrl,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();
    const BookingId = parseInt(req.query.id as string, 10);
    const bookingUpdate = mapToPrisma(req.body);
    const updatedBooking = await prisma.booking.update({
      where: {
        ...(BookingId && { Id: BookingId }),
      },
      data: {
        ...bookingUpdate,
      },
    });
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating Booking:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}