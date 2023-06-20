import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { otherMapper } from 'lib/mappers'

export interface CreateOtherParams {
  Date: string
  DateTypeId: number
  DateBlockId: number
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const other = req.body as CreateOtherParams

    const result = await prisma.other.create({
      data: {
        Date: new Date(other.Date),
        StatusCode: 'U',
        DateType: {
          connect: {
            Id: other.DateTypeId
          }
        },
        DateBlock: {
          connect: {
            Id: other.DateBlockId
          }
        }
      }
    })
    console.log(`Created Other: ${result.Id}`)
    res.status(200).json(otherMapper(result))
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Error Creating Other' })
  }
}
