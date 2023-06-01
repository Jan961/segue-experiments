import { RehearsalDTO } from 'interfaces'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const rehearsal = req.body as RehearsalDTO

  try {
    const results = await prisma.rehearsal.update({
      where: {
        Id: rehearsal.Id
      },
      data: rehearsal
    })
    res.status(200).json(results)
  } catch (e) {
    console.log(e)
    res.status(500)
  }
}
