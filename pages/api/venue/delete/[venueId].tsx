import prisma from 'lib/prisma';

export default async function handle(req, res) {
  let query: number = parseInt(req.query.venueId);
  try {
    await prisma.venue.update({
      where: {
        VenueId: query,
      },
      data: {
        deleted: parseInt('1'),
      },
    });
    res.status(200).end();
  } catch (e) {
    throw e;
  }
}
