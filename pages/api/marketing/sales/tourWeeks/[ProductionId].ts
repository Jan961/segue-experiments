import { UTCDate } from '@date-fns/utc';
import { startOfDay } from 'date-fns';
import getPrismaClient from 'lib/prisma';
import master from 'lib/prisma_master';
import {
  getArrayOfDatesBetween,
  getDateDaysAway,
  getMonday,
  getWeeksBetweenDates,
  newDate,
} from 'services/dateService';
import { getAccountIdFromReq } from 'services/userService';
import formatInputDate from 'utils/dateInputFormat';

export default async function handle(req, res) {
  try {
    const ProductionId = parseInt(req.query.ProductionId, 10);
    const accountId = await getAccountIdFromReq(req);
    const prisma = await getPrismaClient(req);
    const dateBlock = await prisma.dateBlock
      .findMany({
        where: {
          ProductionId,
          IsPrimary: true,
        },
      })
      .then((res) =>
        res.map((x) => ({
          ...x,
          StartDate: new UTCDate(x.StartDate),
        })),
      );

    const prodCo = await master.productionCompany.findMany({
      where: {
        ProdCoAccountId: accountId,
      },
      select: {
        ProdCoSaleStartWeek: true,
      },
    });

    const production = await prisma.production.findUnique({
      where: {
        Id: ProductionId,
      },
      select: {
        SalesFrequency: true,
      },
    });

    const salesStartWeek = prodCo[0].ProdCoSaleStartWeek;
    const numWeeks = salesStartWeek.ProdCoSaleStartWeek > 0 ? salesStartWeek : salesStartWeek * -1;
    const salesFrequency = production.SalesFrequency;

    const startDate = getDateDaysAway(dateBlock[0].StartDate, numWeeks * 7);
    const endDate = dateBlock[0].EndDate;
    const dateStartMonday = getMonday(startDate);
    const weeks = getWeeksBetweenDates(dateStartMonday.toISOString(), endDate.toISOString());

    const result = [];
    let weekNo = numWeeks * -1;
    weeks.forEach((week) => {
      const weekStart = week.mondayDate;
      const weekEnd = getDateDaysAway(newDate(week.mondayDate), 6);

      // skip weekNo 0, there isn't a 0, go straight from -1 to 1
      if (weekNo === 0) {
        weekNo = weekNo + 1;
      }

      // for daily sales
      if (salesFrequency === 'D') {
        const dates = getArrayOfDatesBetween(weekStart, weekEnd.toString());
        dates.forEach((date) => {
          let obj = {
            text: weekNo.toString() + ' ' + formatInputDate(date),
            value: date,
            selected: false,
            weekNo,
          };

          if (startOfDay(new Date(date)).getTime() === startOfDay(new Date()).getTime()) {
            obj = { ...obj, selected: true };
          }

          result.push(obj);
        });

        // for weekly sales
      } else if (salesFrequency === 'W') {
        let obj = {
          text: weekNo.toString() + ' ' + formatInputDate(weekStart) + ' - ' + formatInputDate(weekEnd),
          value: weekStart,
          selected: false,
          weekNo,
        };

        // if current date is between the week start/end, add selected true
        // this will inform the dropdown to select this value
        const todayEpoch = new Date().getTime();
        if (new Date(weekStart).getTime() <= todayEpoch && new Date(weekEnd).getTime() >= todayEpoch) {
          obj = { ...obj, selected: true };
        }
        result.push(obj);
      }
      weekNo = weekNo + 1;
    });

    res.status(200).json({ data: result, frequency: salesFrequency });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting PerformanceLastDates.' });
  }
}
