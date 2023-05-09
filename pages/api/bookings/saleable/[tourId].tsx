import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handle(req, res) {
  try {
    console.log(JSON.stringify(req.query));
    let tourId = "19"; //req.query.tourId;
    console.log(tourId);
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
    console.log(searchResults);
    res.json(searchResults);
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err: "Error occurred while generating search results." });
  }
}
