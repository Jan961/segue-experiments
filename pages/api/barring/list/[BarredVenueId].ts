import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  // "SELECT * FROM `VenueBarredVenue` WHERE VenueId = 331 AND BarredVenueId = 345;"

  // If no Result then not barred
  const venueID = req.query.VenueId;
  const barredVenueId = req.query.BarredVenueId;

  const query = `SELECT * FROM \`VenueBarredVenue\` WHERE VenueId = ${venueID} AND BarredVenueId = ${barredVenueId};`;

  try {
    const prisma = await getPrismaClient(req);
    const result = await prisma.$queryRawUnsafe(`${query}`);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(400);
  }
}
