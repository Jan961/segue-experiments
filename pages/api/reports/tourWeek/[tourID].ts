import prisma from 'lib/prisma';
import moment from 'moment';
import { calculateWeekNumber, getWeeksBetweenDates } from 'services/dateService';

type TourWeek = {
  tourWeekNum: string;
  sundayDate: string;
  mondayDate: string;
};

export default async function handle(req, res) {
  const tourId = parseInt(req.query.tourID);
  try {
    const tourDateBlock = await prisma.DateBlock.findFirst({
      where: {
        TourId: tourId,
        Name: 'Tour',
      },
    });
    const { StartDate, EndDate } = tourDateBlock;
    const weekminus99 = moment(StartDate).subtract(99, 'weeks').set('hour', 0).toISOString();
    const endWeek = moment(EndDate).add(1, 'week').set('hour', 0).toISOString();
    const weeks: TourWeek[] = getWeeksBetweenDates(weekminus99, endWeek).map((week) => ({
      tourWeekNum: calculateWeekNumber(new Date(StartDate), new Date(week.mondayDate)),
      ...week,
    }));
    res.json(weeks);
  } catch (e) {
    console.log(e);
    res.status(401);
  }
}
