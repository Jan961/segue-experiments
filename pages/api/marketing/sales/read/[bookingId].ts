import prisma from 'lib/prisma'

export default async function handle (req, res) {
  try {
    const bookingId = parseInt(req.query.bookingID)
    const searchResults = await prisma.bookingSale.findMany({
      where: {
        BookingId: bookingId
      }
    })

    res.json(searchResults)
  } catch (err) {
    console.log(err)
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
