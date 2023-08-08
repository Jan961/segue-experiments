import prisma from 'lib/prisma'

export default async function handle (req, res) {
  try {
    const tourCode = req.query.tourCode
    const showID = req.query.showID
    const searchResults = await prisma.booking.findMany({
      where: {
        TourId: parseInt(tourCode)
      },
      include: {
        DateType: true,
        Venue: true,
        Tour: {
          include: {
            Show: true
          }
        }
      },
      orderBy: {
        ShowDate: 'asc'
      }
    })

    res.json(searchResults)
  } catch (err) {
    console.log(err)
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
