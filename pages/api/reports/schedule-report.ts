import { Performance, Prisma } from '@prisma/client';
import ExcelJS from 'exceljs';
import prisma from 'lib/prisma';
import moment from 'moment';
import {
  COLOR_HEXCODE,
  alignColumnTextHorizontally,
  colorCell,
  colorTextAndBGCell,
  minutesInHHmmFormat,
  topAndBottomBorder,
} from 'services/salesSummaryService';
import { addWidthAsPerContent } from 'services/reportsService';
import { makeRowTextBoldAndAllignLeft } from './promoter-holds';
import { convertToPDF } from 'utils/report';

type SCHEDULE_VIEW = {
  ProductionId: number;
  FullProductionCode: string;
  ShowName: string;
  RehearsalStartDate: string;
  ProductionStartDate: string;
  ProductionEndDate: string;
  EntryDate: string;
  ProductionWeekNum: number;
  EntryType: string;
  EntryId: number;
  EntryName: string;
  EntryStatusCode: string;
  Location: string;
  PencilNum: number | null;
  VenueId: number | null;
  VenueSeats: number | null;
  Mileage: number | null;
  TimeMins: string | null;
  DateTypeId: number | null;
  DateTypeName: string;
  AffectsAvailability: number;
  SeqNo: number;
};
// type UniqueHeadersObject = {
//   FullProductionCode: string,
//   ShowName: string
// }

interface PerformanceInfo {
  performanceId: number;
  performanceTime: string | null;
  performanceDate: string | null;
}

const makeRowBold = ({ worksheet, row }: { worksheet: any; row: number }) => {
  worksheet.getRow(row).font = { bold: true };
};
const firstRowFormatting = ({ worksheet }: { worksheet: any }) => {
  worksheet.getRow(1).font = { bold: true, size: 16 };
  worksheet.getRow(1).alignment = { horizontal: 'left' };
};
const styleHeader = ({ worksheet, row, numberOfColumns }: { worksheet: any; row: number; numberOfColumns: number }) => {
  for (let col = 1; col <= numberOfColumns; col++) {
    const cell = worksheet.getCell(row, col);
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
  }
};
const addTime = (timeArr: string[] = []) => {
  if (!timeArr?.length) {
    return '00:00';
  }
  const { hour, min } = timeArr.reduce(
    (acc, x) => {
      const [h, m] = x.split(':');
      return {
        hour: Number(h) + acc.hour,
        min: Number(m) + acc.min,
      };
    },
    { hour: 0, min: 0 },
  );
  const minsTime = minutesInHHmmFormat(min);
  const [h, m] = minsTime.split(':');
  return `${hour + Number(h)}:${Number(m)}`;
};
const getKey = ({ FullProductionCode, ShowName, EntryDate }) => `${FullProductionCode} - ${ShowName} - ${EntryDate}`;
// const formatDate = (date) => moment(date).format('DD/MM/YY')

const handler = async (req, res) => {
  const { ProductionId, from, to, format } = req.body;

  //   const formatedFromDate = formatDate(from)
  //   const formatedToDate = formatDate(to)
  if (!ProductionId) {
    throw new Error('Params are missing');
  }
  const conditions: Prisma.Sql[] = [];
  const bookingIdPerformanceMap: Record<number, PerformanceInfo[]> = {};
  if (from && to) {
    conditions.push(Prisma.sql`EntryDate BETWEEN ${from} AND ${to}`);
  }
  if (ProductionId) {
    conditions.push(Prisma.sql` ProductionId=${ProductionId}`);
  }
  const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty;
  const data: SCHEDULE_VIEW[] = await prisma.$queryRaw`select * FROM ScheduleView ${where} order by EntryDate;`;
  const bookingIdList: number[] =
    data.map((entry) => (entry.EntryType === 'Booking' ? entry.EntryId : null)).filter((id) => id) || [];
  const performances: Performance[] = await prisma.performance.findMany({
    where: {
      BookingId: {
        in: bookingIdList,
      },
    },
  });
  performances.forEach((performance) => {
    const { Id, BookingId, Time, Date } = performance;

    if (!bookingIdPerformanceMap[BookingId]) {
      bookingIdPerformanceMap[BookingId] = [];
    }

    bookingIdPerformanceMap[BookingId].push({
      performanceId: Id,
      performanceTime: Time ? moment.utc(Time).format('HH:mm') : null,
      performanceDate: Date ? Date.toISOString() : null,
    });
  });
  const { RehearsalStartDate: fromDate, ProductionEndDate: toDate } = data?.[0] || {};
  const workbook = new ExcelJS.Workbook();
  const formattedData = data.map((x) => ({
    ...x,
    EntryDate: moment(x.EntryDate).format('YYYY-MM-DD'),
    ProductionStartDate: moment(x.ProductionStartDate).format('YYYY-MM-DD'),
    ProductionEndDate: moment(x.ProductionEndDate).format('YYYY-MM-DD'),
  }));
  const worksheet = workbook.addWorksheet('Travel Summary', {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    views: [{ state: 'frozen', xSplit: 0, ySplit: 5 }],
  });
  if (!formattedData?.length) {
    const filename = 'Booking Report.xlsx';
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    await workbook.xlsx.write(res).then(() => {
      res.end();
    });
    return;
  }
  const { ShowName, FullProductionCode } = data[0];
  const title = `${FullProductionCode} ${ShowName} Tour Schedule - ${moment().format('DD.MM.YY')}`;
  worksheet.addRow([title]);
  worksheet.addRow([`Exported: ${moment().format('DD/MM/YY [at] HH:mm')} - Layout: Standard`]);
  worksheet.addRow(['', '', '', '', '', '', '', '', 'PERFS', 'PERF1', 'PERF2', '']);
  worksheet.addRow([
    'PROD',
    'DAY',
    'DATE',
    'WEEK',
    'VENUE/DETAILS',
    'TOWN',
    'PENCIL',
    'CAPACITY',
    '/DAY',
    'TIME',
    'TIME',
    'MILES',
    'TIME',
  ]);
  worksheet.addRow([]);
  const map: { [key: string]: SCHEDULE_VIEW } = formattedData.reduce((acc, x) => ({ ...acc, [getKey(x)]: x }), {});
  const daysDiff = moment(toDate).diff(moment(fromDate), 'days');
  let rowNo = 5;
  let prevProductionWeekNum = '';
  let lastWeekMetaInfo = {
    weekTotalPrinted: false,
    prevProductionWeekNum: '',
  };
  const time: string[] = [];
  const mileage: number[] = [];
  let totalTime: string[] = [];
  let totalMileage: number[] = [];
  const seats: number[] = [];
  const performancesPerDay: number[] = [];
  for (let i = 1; i <= daysDiff; i++) {
    lastWeekMetaInfo = { ...lastWeekMetaInfo, weekTotalPrinted: false };
    const weekDay = moment(moment(fromDate).add(i - 1, 'day')).format('dddd');
    const dateInIncomingFormat = moment(moment(fromDate).add(i - 1, 'day'));
    const key = getKey({ FullProductionCode, ShowName, EntryDate: dateInIncomingFormat.format('YYYY-MM-DD') });
    const value: SCHEDULE_VIEW = map[key];
    const isOtherDay = [
      'Day Off',
      'Travel Day',
      'Get-In / Fit-Up Day',
      'Tech / Dress Day',
      'Rehearsal Day',
      'Declared Holiday',
    ].includes(value?.EntryName);
    const isCancelled = value?.EntryStatusCode === 'X';
    if (!value) {
      worksheet.addRow([
        FullProductionCode,
        weekDay.substring(0, 3),
        dateInIncomingFormat.format('DD/MM/YY'),
        prevProductionWeekNum,
      ]);
      colorTextAndBGCell({
        worksheet,
        row: rowNo + 1,
        col: 5,
        textColor: COLOR_HEXCODE.BLACK,
        cellColor: COLOR_HEXCODE.WHITE,
      });
    } else {
      const { ProductionWeekNum, Location, EntryName, TimeMins, Mileage, VenueSeats, EntryId, PencilNum } = value;
      const formattedTime = TimeMins ? minutesInHHmmFormat(Number(TimeMins)) : '';
      const performances = bookingIdPerformanceMap[EntryId];
      const performancesOnThisDay = performances?.filter?.((performance) =>
        moment(performance.performanceDate).isSame(dateInIncomingFormat, 'day'),
      );
      time.push(formattedTime || '00:00');
      mileage.push(Number(Mileage) || 0);
      seats.push(Number(VenueSeats) || 0);
      performancesPerDay.push(performances?.length || 0);
      prevProductionWeekNum = ProductionWeekNum ? String(ProductionWeekNum) : prevProductionWeekNum;
      worksheet.addRow([
        FullProductionCode,
        weekDay.substring(0, 3),
        dateInIncomingFormat.format('DD/MM/YY'),
        ProductionWeekNum,
        EntryName || '',
        ...((!isOtherDay &&
          !isCancelled && [
            Location || '',
            PencilNum,
            VenueSeats,
            performancesOnThisDay?.length,
            performancesOnThisDay?.[0]?.performanceTime || '',
            performancesOnThisDay?.[1]?.performanceTime || '',
            Number(Mileage) || '',
            formattedTime,
          ]) ||
          []),
      ]);
    }
    rowNo++;

    if (isOtherDay) {
      colorTextAndBGCell({
        worksheet,
        row: rowNo,
        col: 5,
        textColor: COLOR_HEXCODE.YELLOW,
        cellColor: COLOR_HEXCODE.RED,
      });
    }
    if (isCancelled) {
      colorTextAndBGCell({
        worksheet,
        row: rowNo,
        col: 5,
        textColor: COLOR_HEXCODE.WHITE,
        cellColor: COLOR_HEXCODE.BLACK,
      });
    }
    if (weekDay === 'Monday') {
      colorCell({ worksheet, row: rowNo, col: 1, argbColor: COLOR_HEXCODE.CREAM });
      colorCell({ worksheet, row: rowNo, col: 2, argbColor: COLOR_HEXCODE.CREAM });
      colorCell({ worksheet, row: rowNo, col: 3, argbColor: COLOR_HEXCODE.CREAM });
    }
    lastWeekMetaInfo = { ...lastWeekMetaInfo, prevProductionWeekNum };
  }
  if (time.length) {
    totalTime = [...totalTime, ...time];
  }
  if (mileage.length) {
    totalMileage = [...totalMileage, ...mileage];
  }
  worksheet.addRow([
    '',
    '',
    '',
    '',
    'PRODUCTION TOTALS',
    '',
    '',
    seats.reduce((acc, m) => acc + Number(m || 0), 0),
    performancesPerDay.reduce((acc, m) => acc + Number(m || 0), 0),
    '',
    '',
    totalMileage.reduce((acc, m) => acc + Number(m || 0), 0),
    addTime(totalTime),
  ]);
  rowNo++;
  makeRowBold({ worksheet, row: rowNo });
  const numberOfColumns = worksheet.columnCount;
  topAndBottomBorder({ worksheet, row: rowNo, colFrom: 5, colTo: numberOfColumns, borderStyle: 'double' });

  worksheet.mergeCells('F3:G3');
  worksheet.mergeCells('A1:G1');
  for (let char = 'A', i = 0; i <= numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
    if (char === 'A' || char === 'B') {
      worksheet.getColumn(char).width = 12;
    } else {
      worksheet.getColumn(char).width = 20;
      alignColumnTextHorizontally({ worksheet, colAsChar: char, align: 'center' });
    }
  }
  firstRowFormatting({ worksheet });
  for (let row = 2; row <= 4; row++) {
    styleHeader({ worksheet, row, numberOfColumns });
  }
  worksheet.getCell(1, 1).font = { size: 20, color: { argb: COLOR_HEXCODE.WHITE }, bold: true };
  for (let row = 1; row <= 4; row++) {
    makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns });
  }
  addWidthAsPerContent({
    worksheet,
    fromColNumber: 1,
    toColNumber: numberOfColumns,
    startingColAsCharWIthCapsOn: 'B',
    minColWidth: 10,
    bufferWidth: 0,
    rowsToIgnore: 4,
    maxColWidth: Infinity,
  });
  worksheet.getColumn('A').width = 7;
  worksheet.getColumn('B').width = 5;
  worksheet.getColumn('C').width = 12;
  worksheet.getColumn('D').width = 5;
  // worksheet.getColumn('H').width = 5;
  worksheet.getColumn('I').width = 5;
  worksheet.getColumn('J').width = 7;
  worksheet.getColumn('K').width = 7;
  worksheet.getColumn('L').width = 7;
  worksheet.getColumn('M').width = 7;
  const filename = `${title}.xlsx`;
  if (format === 'pdf') {
    worksheet.pageSetup.printArea = `A1:${worksheet.getColumn(11).letter}${worksheet.rowCount}`;
    worksheet.pageSetup.fitToWidth = 1;
    worksheet.pageSetup.fitToHeight = 1;
    worksheet.pageSetup.orientation = 'landscape';
    worksheet.pageSetup.fitToPage = true;
    worksheet.pageSetup.margins = {
      left: 0.25,
      right: 0.25,
      top: 0.25,
      bottom: 0.25,
      header: 0.3,
      footer: 0.3,
    };
    const pdf = await convertToPDF(workbook);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
    res.end(pdf);
    return;
  }
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  workbook.xlsx.write(res).then(() => {
    res.end();
  });
};

export default handler;
