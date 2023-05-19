import prisma from 'lib/prisma'

export default async function handle(req, res) {
  try {

    let tourId = req.query.tourId //req.query.tourId;

    const searchResults = await prisma.booking.findMany({
      where: {
        TourId: parseInt(tourId),
        VenueId: {
          not: null,
        },
      },
      include: {
        DateType: true,
        Venue: true,
        Tour: {
          include: {
            Show: true,
          },
        },
      },
      orderBy: {
        ShowDate: "asc",
      },
    });

    res.json(searchResults);
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err: "Error occurred while generating search results." });
  }
}
