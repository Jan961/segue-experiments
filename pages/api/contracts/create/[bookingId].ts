import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { checkAccess, getEmailFromReq } from 'services/userService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.bookingId as string)

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { BookingId })
    if (!access) return res.status(401).end()

    const createResult = await prisma.contract.create({
      data: {
        BookingId,
        BarringClauseBreaches: req.body.BarringClauseBreaches
      }
    })

    return res.json(createResult)
  } catch (err) {
    console.log(err)
    res
      .status(403)
      .json({ err: 'Error occurred while creating the contract.' })
  }
}
