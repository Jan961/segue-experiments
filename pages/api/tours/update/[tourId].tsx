import { PrismaClient } from '@prisma/client'
import { parseISO } from 'date-fns'
const prisma = new PrismaClient()

const safeParseDate = (date: string) => {
  if (!date) return null
  return parseISO(date)
}

const safeParseInt = (value: string) => {
  if (!value) return null
  return parseInt(value)
}

export default async function handle (req, res) {
  const query: number = parseInt(req.query.tourId)
  try {
    await prisma.tour.update({
      where: {
        TourId: query
      },
      data: {
        Code: req.body.Code,
        ShowId: safeParseInt(req.body.ShowId),
        TourStartDate: safeParseDate(req.body.TourStartDate),
        TourEndDate: safeParseDate(req.body.TourEndDate),
        Archived: false,
        Deleted: false,
        RehearsalStartDate: safeParseDate(req.body.RehearsalStartDate),
        RehearsalEndDate: safeParseDate(req.body.RehearsalEndDate),
        TourOwner: safeParseInt(req.body.Owner), // null For some reason
        Logo: req.body.logo,
        CreatedBy: 0
      }
    })
    res.status(200).end()
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
  return res
}
