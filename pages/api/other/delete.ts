import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { OtherDTO } from 'interfaces'
import { getEmailFromReq, checkAccess } from 'services/userService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const other = req.body as OtherDTO

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { OtherId: other.Id })
    if (!access) return res.status(401)

    await prisma.$transaction([
      prisma.other.delete({
        where: {
          Id: other.Id
        }
      })
    ])
    console.log(`Deleted Other: ${other.Id}`)
    return res.status(200).json({})
  } catch (e) {
    console.log(e)
    return res.status(500).json({ err: 'Error Deleting Other' })
  }
}
