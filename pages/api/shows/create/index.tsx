import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { ShowDTO } from 'interfaces'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const show: ShowDTO = req.body

  try {
    await prisma.show.create({
      data: { ...show, AccountId: 1 }
    })

    res.status(200).end()
  } catch (err) {
    console.log(err)
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
