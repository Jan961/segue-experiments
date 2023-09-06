import prisma from 'lib/prisma'

export default async function handle (req, res) {
  try {
    const searchResults = await prisma.hold.findMany({
      where: {

      }
    })

    res.json(searchResults)
  } catch (err) {
    console.log(err)
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
