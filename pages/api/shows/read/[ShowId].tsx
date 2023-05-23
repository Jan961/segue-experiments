import { NextApiRequest, NextApiResponse } from 'next'
import { getShowById } from 'services/ShowService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const showId = parseInt(req.query.ShowId as string)
    const show = await getShowById(showId)

    res.json(show)
  } catch (err) {
    console.log(err)
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
