import { TourDTO } from 'interfaces'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const dto = req.body as TourDTO

  const existingDateBlockIds = dto.DateBlock.filter(db => db.Id).map(db => db.Id)
  const existingDateBlocks = dto.DateBlock.filter(db => db.Id)
  const newDateBlocks = dto.DateBlock.filter(db => !db.Id)

  // No checking about losing events yet. That depends on booking structure.
  try {
    await prisma.$transaction([
      prisma.tour.update({
        where: { Id: dto.Id },
        data: {
          Code: dto.Code,
          IsArchived: dto.IsArchived,
          DateBlock: {
            // Remove DateBlocks not in the DTO
            deleteMany: {
              NOT: { Id: { in: existingDateBlockIds } },
              TourId: dto.Id
            },
            // Update existing DateBlocks
            updateMany: existingDateBlocks.map(db => ({
              where: { Id: db.Id, TourId: dto.Id },
              data: {
                StartDate: new Date(db.StartDate),
                EndDate: new Date(db.EndDate),
                Name: db.Name
              }
            })),
            // Create new DateBlocks. This has to come last (otherwise deleteMany will remove)
            create: newDateBlocks.map(db => ({
              StartDate: new Date(db.StartDate),
              EndDate: new Date(db.EndDate),
              Name: db.Name
            }))
          }
        }
      })
    ])

    res.status(200).end()
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Error occurred while saving tour.' })
  }
}
