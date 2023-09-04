import prisma from 'lib/prisma'

export default async function handle (req, res) {
  try {
    const AccountId = req.query.AccountId
    const searchResults = await prisma.show.findMany({
      where: {
        AccountId: parseInt(AccountId),
        Archived: false
      }
    })

    res.json(searchResults)
  } catch (err) {
    console.log(err)
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
