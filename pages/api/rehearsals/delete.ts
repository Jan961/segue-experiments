import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { RehearsalDTO } from 'interfaces'
import { getEmailFromReq, checkAccess } from 'services/userService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const rehearsal = req.body as RehearsalDTO

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { RehearsalId: rehearsal.Id })
    if (!access) return res.status(401).end()

    await prisma.$transaction([
      prisma.rehearsal.delete({
        where: {
          Id: rehearsal.Id
        }
      })
    ])
    console.log(`Deleted Rehearsal: ${rehearsal.Id}`)
    res.status(200).json({})
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 'Error Deleting Rehearsal' })
  }
}
