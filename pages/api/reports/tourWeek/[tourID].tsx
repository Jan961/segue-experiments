import prisma from 'lib/prisma'
import { calculateWeekNumber, getWeeksBetweenDates } from 'services/dateService'

type TourWeek = {
  tourWeekNum:string;
  sundayDate:string;
  mondayDate:string;
}

export default async function handle (req, res) {
  const tourId = parseInt(req.query.tourID)
  try {
    const tourDateBlock = await prisma.DateBlock.findFirst({
      where: {
        TourId: tourId,
        Name: 'Tour'
      }
    })
    const { StartDate, EndDate } = tourDateBlock
    const weeks:TourWeek[] = getWeeksBetweenDates(StartDate, EndDate).map((week) => ({
      tourWeekNum: calculateWeekNumber(new Date(StartDate), new Date(week.mondayDate)),
      ...week
    }))
    res.json(weeks)
  } catch (e) {
    console.log(e)
    res.status(401)
  }
}
