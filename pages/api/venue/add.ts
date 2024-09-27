import getPrismaClient from 'lib/prisma';
import prismaMaster from 'lib/prisma_master';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prisma = await getPrismaClient(req);
    // Input validation
    if (
      !req.body.code ||
      !req.body.name ||
      !req.body.country ||
      !req.body.seats ||
      !req.body.website ||
      !req.body.accountId
    ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const venueData = {
      Code: req.body.code,
      Name: req.body.name,
      Country: req.body.country,
      Seats: parseInt(req.body.seats),
      Website: req.body.website,
      deleted: 0,
      AccountId: req.body.accountId,
    };

    // Find user by accountId
    const user = await prismaMaster.user.findFirst({
      where: { AccountId: req.body.accountId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.SegueAdmin === 1) {
      // Create a new master venue
      await prisma.masterVenue.create({
        data: venueData,
      });
    } else {
      // Create a new venue
      await prisma.venue.create({
        data: venueData,
      });
    }

    let inserted;
    if (user.SegueAdmin === 1) {
      inserted = await prisma.masterVenue.findFirst({
        where: {
          Code: req.body.code,
          Name: req.body.name,
          Country: req.body.country,
          Seats: parseInt(req.body.seats),
          Website: req.body.website,
          AccountId: req.body.accountId,
        },
      });
    } else {
      inserted = await prisma.venue.findFirst({
        where: {
          Code: req.body.code,
          Name: req.body.name,
          Country: req.body.country,
          Seats: parseInt(req.body.seats),
          Website: req.body.website,
          AccountId: req.body.accountId,
        },
      });
    }

    res.json(inserted);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
}
