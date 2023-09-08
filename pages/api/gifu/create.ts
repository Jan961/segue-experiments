import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { getInFitUpMapper } from 'lib/mappers'
import { checkAccess, getEmailFromReq } from 'services/userService'

export interface CreateGifuParams {
  DateBlockId: number
  Date: string
  VenueId: number
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const gifu = req.body as CreateGifuParams
    const { DateBlockId, VenueId } = gifu

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { DateBlockId })
    if (!access) return res.status(401).end()

    const result = await prisma.getInFitUp.create({
      data: {
        Date: new Date(gifu.Date),
        DateBlock: {
          connect: {
            Id: DateBlockId
          }
        },
        Venue: {
          connect: {
            Id: VenueId
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
