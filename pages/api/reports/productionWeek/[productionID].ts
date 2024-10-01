import getPrismaClient from 'lib/prisma';
import moment from 'moment';
import { calculateWeekNumber, getWeeksBetweenDates } from 'services/dateService';

type ProductionWeek = {
  productionWeekNum: string;
  sundayDate: string;
  mondayDate: string;
};

export default async function handle(req, res) {
  const productionId = parseInt(req.query.productionID);
  try {
    const prisma = await getPrismaClient(req);
    const productionDateBlock = await prisma.dateBlock.findFirst({
      where: {
        ProductionId: productionId,
        Name: 'Production',
      },
    });
    const { StartDate, EndDate } = productionDateBlock;
    const weekminus99 = moment(StartDate).subtract(99, 'weeks').set('hour', 0).toISOString();
    const endWeek = moment(EndDate).add(1, 'week').set('hour', 0).toISOString();
    const weeks: ProductionWeek[] = getWeeksBetweenDates(weekminus99, endWeek).map((week) => ({
      productionWeekNum: calculateWeekNumber(new Date(StartDate), new Date(week.mondayDate)),
      ...week,
    }));
    res.json(weeks);
  } catch (e) {
    console.log(e);
    res.status(401);
  }
}
