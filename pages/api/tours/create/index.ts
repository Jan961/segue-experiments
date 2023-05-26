import { TourDTO } from 'interfaces'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const tour: TourDTO = req.body

  try {
    await prisma.tour.create({
      data: {
        Code: tour.Code,
        IsArchived: tour.IsArchived,
        ShowId: tour.ShowId,
        DateBlock: {
          create: tour.DateBlock.map(dateBlock => ({
            Name: dateBlock.Name,
            StartDate: new Date(dateBlock.StartDate),
            EndDate: new Date(dateBlock.EndDate)
          }))
        }
      }
    })

    res.status(200).end()
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Error occurred while creating tour.' })
  }
}
