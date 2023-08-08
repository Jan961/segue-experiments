import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { GetInFitUpDTO } from 'interfaces'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const gifu = req.body as GetInFitUpDTO
    await prisma.$transaction([
      prisma.getInFitUp.delete({
        where: {
          Id: gifu.Id
        }
      })
    ])
    console.log(`Deleted GIFU: ${gifu.Id}`)
    return res.status(200).json({})
  } catch (e) {
    console.log(e)
    return res.status(500).json({ err: 'Error Deleting GIFU' })
  }
}
