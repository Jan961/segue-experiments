import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).end(); // Method Not Allowed
  }
  try {
    const prisma = await getPrismaClient(req);
    const { VenueId, ...updatedData } = req.body;
    if (!VenueId) {
      return res.status(400).json({ error: 'missing required params' });
    }
    // Update the Venue entry in the database
    const updatedVenue = await prisma.venue.update({
      where: {
        ...(VenueId && { Id: VenueId }),
      },
      data: updatedData,
    });
    return res.status(200).json(updatedVenue);
  } catch (error) {
    console.error('Error updating Venue:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
