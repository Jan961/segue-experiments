import prisma from 'lib/prisma'

export default async function handle (req, res) {
  try {
    const bookingId = req.query.bookingId
    const searchResults = await prisma.booking.findMany({
      include: {
        Contract: true,
        Venue: true,
        Performance: true
      },
      where: {
        Id: parseInt(bookingId)
      }
    })

    await res.json(searchResults)
  } catch (err) {
    console.log(err)
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
