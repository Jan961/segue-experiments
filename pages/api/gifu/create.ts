import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { getInFitUpMapper } from 'lib/mappers'

export interface CreateGifuParams {
  DateBlockId: number
  Date: string
  VenueId: number
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const gifu = req.body as CreateGifuParams

    const result = await prisma.getInFitUp.create({
      data: {
        Date: new Date(gifu.Date),
        DateBlock: {
          connect: {
            Id: gifu.DateBlockId
          }
        },
        Venue: {
          connect: {
            Id: gifu.VenueId
          }
        }
      }
    })
    res.status(200).json(getInFitUpMapper(result))
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 'Error Creating GIFU' })
  }
}
