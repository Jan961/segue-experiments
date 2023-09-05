import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { otherMapper } from 'lib/mappers'
import { getEmailFromReq, checkAccess } from 'services/userService'

export interface CreateOtherParams {
  Date: string
  DateTypeId: number
  DateBlockId: number
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const other = req.body as CreateOtherParams

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { DateBlockId: other.DateBlockId })
    if (!access) return res.status(401)

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
