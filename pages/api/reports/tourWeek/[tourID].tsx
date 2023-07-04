import prisma from 'lib/prisma'

type TourWeek = {
    f0:string,
    f1:string,
    f3:string
}

export default async function handle (req, res) {
  const tourId = parseInt(req.query.tourID)
  try {
    const tourWeeks:TourWeek[] = await prisma.$queryRaw`CALL GetScheduleWeeks(${tourId})`
    res.json({ data: tourWeeks.map(({ f0: Id, f1: MondayDate }:TourWeek) => ({ Id, MondayDate })) })
  } catch (e) {
    console.log(e)
    res.status(401)
  }
}
