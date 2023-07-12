import prisma from 'lib/prisma'

export default async function handle (req, res) {
  try {
    const tourId = req.query.tourId // req.query.tourId;

    const searchResults = await prisma.booking.findMany({
      where: {
        DateBlock: {
          is: {
            TourId: parseInt(tourId)
          }
        },
        VenueId: {
          not: undefined
        }
      },
      include: {
        Venue: true,
        DateBlock: {
          include: {
            Tour: {
              include: {
                Show: true
              }
            }
          }
        }
      },
      orderBy: {
        FirstDate: 'asc'
      }
    })

    const result = searchResults.map(x => ({ ...x, Tour: x.DateBlock.Tour }))

    return res.json(result)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ err: 'Error occurred while generating search results.' })
  }
}
