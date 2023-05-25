import { ShowDTO } from 'interfaces'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const show = req.body as ShowDTO

  try {
    await prisma.show.update({
      where: {
        Id: show.Id
      },
      data: show
    })
    res.status(200).end()
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
  return res
}
