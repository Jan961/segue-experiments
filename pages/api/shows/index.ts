import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getAccountIdFromReq } from 'services/userService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const AccountId = getAccountIdFromReq(req)

  const shows = await prisma.show.findMany(
    {
      where: {
        Deleted: false,
        AccountId
      }
    }
  )
  res.json(shows)
}
