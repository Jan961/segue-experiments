import { UTCDate } from '@date-fns/utc';
import getPrismaClient from 'lib/prisma';
import { calculateWeekNumber, getDateDaysAway, getWeeksBetweenDates, newDate } from 'services/dateService';

type ProductionWeek = {
  productionWeekNum: string;
  sundayDate: string;
  mondayDate: string;
};

export default async function handle(req, res) {
  const productionId = parseInt(req.query.productionID);
  try {
    const prisma = await getPrismaClient(req);
    const productionDateBlock = await prisma.dateBlock
      .findFirst({
        where: {
          ProductionId: productionId,
          Name: 'Production',
        },
      })
      .then((res) => ({
        ...res,
        StartDate: new UTCDate(res.StartDate),
        EndDate: new UTCDate(res.EndDate),
      }));
    const { StartDate, EndDate } = productionDateBlock;
    const weekminus99 = getDateDaysAway(StartDate.toISOString(), -7 * 99);
    const endWeek = getDateDaysAway(EndDate, 1 * 7).toISOString();
    const weeks: ProductionWeek[] = getWeeksBetweenDates(weekminus99.toISOString(), endWeek).map((week) => ({
      productionWeekNum: calculateWeekNumber(StartDate.toISOString(), newDate(week.mondayDate)),
      ...week,
    }));
    res.json(weeks);
  } catch (e) {
    console.log(e);
    res.status(401);
  }
}
