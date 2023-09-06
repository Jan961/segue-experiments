import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const hold = await prisma.bookingPromoterHoldAllocation.findFirst({
      where: {
        HoldAllocationId: parseInt(req.query.HoldId as string)
      }
    })
    res.status(200).json(hold)
  } catch (e) {
    res.status(400)
  }
}
