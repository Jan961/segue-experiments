import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const VenueId: number = parseInt(req.query.venueID as string)
  try {
    //  console.log(JSON.stringify(req.body))
    await prisma.venue.update({
      where: {
        VenueId
      },
      data: {
        TechSpecsURL: req.body.TechSpecsURL,
        StageSize: req.body.StageSize,
        LXDesk: req.body.LXDesk,
        GridHeight: req.body.GridHeight,
        LXNotes: req.body.LXNotes,
        VenueFlags: req.body.VenueFlags,
        SoundDesk: req.body.SoundDesk,
        SoundNotes: req.body.SoundNotes
      }

    })
    res.status(200).end()
  } catch (e) {
    res.status(501).end()
  }
  return res
}
