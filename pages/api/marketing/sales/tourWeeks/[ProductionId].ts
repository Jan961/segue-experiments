import { startOfDay } from 'date-fns';
import prisma from 'lib/prisma';
import { addDurationToDate, getArrayOfDatesBetween, getMonday, getWeeksBetweenDates } from 'services/dateService';
import { getEmailFromReq, checkAccess, getAccountIdFromReq } from 'services/userService';
import formatInputDate from 'utils/dateInputFormat';

export default async function handle(req, res) {
  try {
    const ProductionId = parseInt(req.query.ProductionId, 10);

    const email = await getEmailFromReq(req);
    const accountId = await getAccountIdFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    const dateBlock =
      await prisma.$queryRaw`select * from DateBlock WHERE DateBlockProductionId = ${ProductionId} AND DateBlockIsPrimary = 1`;

    const prodCo =
      await prisma.$queryRaw`select ProdCoSaleStartWeek from ProductionCompany WHERE ProdCoAccountId = ${accountId}`;

    const production =
      await prisma.$queryRaw`select ProductionSalesFrequency from Production WHERE ProductionId = ${ProductionId}`;

    const salesStartWeek = prodCo[0].ProdCoSaleStartWeek;
    const numWeeks = salesStartWeek.ProdCoSaleStartWeek > 0 ? salesStartWeek : salesStartWeek * -1;
    const salesFrequency = production[0].ProductionSalesFrequency;

    const startDate = addDurationToDate(dateBlock[0].DateBlockStartDate, numWeeks * 7, false);
    const endDate = dateBlock[0].DateBlockEndDate;
    const dateStartMonday = getMonday(startDate);
    const weeks = getWeeksBetweenDates(dateStartMonday.toISOString(), endDate);

    const result = [];
    let weekNo = numWeeks * -1;
    weeks.forEach((week) => {
      const weekStart = week.mondayDate;
      const weekEnd = addDurationToDate(new Date(week.mondayDate), 6, true);

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
