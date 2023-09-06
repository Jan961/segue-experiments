import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getAccountIdFromReq } from 'services/userService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const AccountId = await getAccountIdFromReq(req)

  try {
    const searchResults = await prisma.account.findFirst(
      {
        where: {
          AccountId
        }
      }
    )

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ searchResults }))
  } catch (error) {
    console.log(error)
    res.json(error)
    res.status(405).end()
  }
}
