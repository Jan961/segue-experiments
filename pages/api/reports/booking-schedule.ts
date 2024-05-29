import { Prisma } from '@prisma/client';
import ExcelJS from 'exceljs';
import prisma from 'lib/prisma';
import moment from 'moment';
import {
  COLOR_HEXCODE,
  colorCell,
  colorTextAndBGAndItalicCell,
  colorTextAndBGCell,
  minutesInHHmmFormat,
  topAndBottomBorder,
} from 'services/salesSummaryService';
import { addWidthAsPerContent } from 'services/reportsService';

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
  const { ProductionId } = JSON.parse(req.body) || {};

  // const formatedFromDate = formatDate(fromDate)
  // const formatedToDate = formatDate(toDate)
  // if (!fromDate || !toDate || !ProductionId) {
  //   throw new Error('Params are missing')
  // }
  const conditions: Prisma.Sql[] = [];
  // if (fromDate && toDate) {
  //   conditions.push(Prisma.sql`EntryDate BETWEEN ${fromDate} AND ${toDate}`)
  // }
  if (ProductionId) {
    conditions.push(Prisma.sql` ProductionId=${ProductionId}`);
  }
  const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty;
  const data: SCHEDULE_VIEW[] = await prisma.$queryRaw`select * FROM ScheduleView ${where} order by EntryDate;`;
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
  const title = `${FullProductionCode} ${ShowName} Travel Summary - ${moment().format('DD.MM.YY')}`;
  worksheet.addRow([title]);
  worksheet.addRow([]);
  worksheet.addRow(['Production', '', '', '', '', 'Onward Travel']);
  worksheet.addRow(['Day', 'Date', 'Week', 'Venue', 'Town', 'Time', 'Miles']);
  // Day, Date, Week, Venue, Town, Time, Miles
  worksheet.addRow([]);
  const map: { [key: string]: SCHEDULE_VIEW } = formattedData.reduce((acc, x) => ({ ...acc, [getKey(x)]: x }), {});
  const daysDiff = moment(toDate).diff(moment(fromDate), 'days');
  let rowNo = 5;
  let prevProductionWeekNum = '';
  let lastWeekMetaInfo = {
    weekTotalPrinted: false,
    prevProductionWeekNum: '',
  };
  let time: string[] = [];
  let mileage: number[] = [];
  let totalTime: string[] = [];
  let totalMileage: number[] = [];
  for (let i = 1; i <= daysDiff; i++) {
    lastWeekMetaInfo = { ...lastWeekMetaInfo, weekTotalPrinted: false };
    const weekDay = moment(moment(fromDate).add(i - 1, 'day')).format('dddd');
    const dateInIncomingFormat = moment(moment(fromDate).add(i - 1, 'day'));
    const key = getKey({ FullProductionCode, ShowName, EntryDate: dateInIncomingFormat.format('YYYY-MM-DD') });
    const value: SCHEDULE_VIEW = map[key];
    if (!value) {
      worksheet.addRow([weekDay.substring(0, 3), dateInIncomingFormat.format('DD/MM/YY'), `${prevProductionWeekNum}`]);
      colorTextAndBGCell({
        worksheet,
        row: rowNo + 1,
        col: 4,
        textColor: COLOR_HEXCODE.WHITE,
        cellColor: COLOR_HEXCODE.BLACK,
      });
    } else {
      const { ProductionWeekNum, Location, EntryName, TimeMins, Mileage } = value;
      const formattedTime = TimeMins ? minutesInHHmmFormat(Number(TimeMins)) : '';
      time.push(formattedTime || '00:00');
      mileage.push(Number(Mileage) || 0);
      prevProductionWeekNum = ProductionWeekNum ? String(ProductionWeekNum) : prevProductionWeekNum;
      // localhost:8002/api/v1/dummy
      worksheet.addRow([
        weekDay.substring(0, 3),
        dateInIncomingFormat.format('DD/MM/YY'),
        `${ProductionWeekNum}`,
        EntryName || '',
        Location || '',
        formattedTime,
        Number(Mileage) || '',
      ]);
    }
    rowNo++;

    if (
      [
        'Day Off',
        'Travel Day',
        'Get-In / Fit-Up Day',
        'Tech / Dress Day',
        'Rehearsal Day',
        'Declared Holiday',
      ].includes(value?.EntryName)
    ) {
      colorTextAndBGAndItalicCell({
        worksheet,
        row: rowNo,
        col: 4,
        textColor: COLOR_HEXCODE.YELLOW,
        cellColor: COLOR_HEXCODE.RED,
      });
    }
    if (weekDay === 'Sunday') {
      worksheet.addRow([
        '',
        '',
        '',
        '',
        `Production Week ${value?.ProductionWeekNum || prevProductionWeekNum || ''}`,
        addTime(time),
        mileage.reduce((acc, m) => acc + Number(m || 0), 0),
      ]);
      totalTime = [...totalTime, ...time];
      totalMileage = [...totalMileage, ...mileage];
      time = [];
      mileage = [];
      rowNo++;
      makeRowBold({ worksheet, row: rowNo });
      topAndBottomBorder({ worksheet, row: rowNo, colFrom: 5, colTo: 7, borderStyle: 'thin' });
      lastWeekMetaInfo = { ...lastWeekMetaInfo, weekTotalPrinted: true };
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

  if (!lastWeekMetaInfo.weekTotalPrinted) {
    worksheet.addRow([
      '',
      '',
      '',
      '',
      `Production Week ${lastWeekMetaInfo?.prevProductionWeekNum || ''}`,
      addTime(time),
      mileage.reduce((acc, m) => acc + Number(m || 0), 0),
    ]);
    rowNo++;
    makeRowBold({ worksheet, row: rowNo });
    topAndBottomBorder({ worksheet, row: rowNo, colFrom: 5, colTo: 7, borderStyle: 'thin' });
  }
  worksheet.addRow([
    '',
    '',
    '',
    '',
    'PRODUCTION TOTALS',
    addTime(totalTime),
    totalMileage.reduce((acc, m) => acc + Number(m || 0), 0),
  ]);
  rowNo++;
  makeRowBold({ worksheet, row: rowNo });
  topAndBottomBorder({ worksheet, row: rowNo, colFrom: 5, colTo: 7, borderStyle: 'double' });

  const numberOfColumns = worksheet.columnCount;
  worksheet.mergeCells('F3:G3');
  worksheet.mergeCells('A1:G1');
  for (let char = 'A', i = 0; i <= numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
    if (char === 'A' || char === 'B') {
      worksheet.getColumn(char).width = 12;
    } else {
      worksheet.getColumn(char).width = 20;
    }
  }
  // alignCellText({ worksheet, row: 1, col: 1, align: ALIGNMENT.LEFT })
  // alignCellText({ worksheet, row: 2, col: 1, align: ALIGNMENT.LEFT })
  // alignCellText({ worksheet, row: 5, col: 2, align: ALIGNMENT.LEFT })
  worksheet.getColumn('C').alignment = { horizontal: 'right' };
  worksheet.getColumn('F').alignment = { horizontal: 'right' };
  worksheet.getColumn('G').alignment = { horizontal: 'right' };
  firstRowFormatting({ worksheet });
  for (let row = 2; row <= 4; row++) {
    styleHeader({ worksheet, row, numberOfColumns });
  }

  addWidthAsPerContent({
    worksheet,
    fromColNumber: 2,
    toColNumber: numberOfColumns,
    startingColAsCharWIthCapsOn: 'B',
    minColWidth: 10,
    bufferWidth: 0,
    rowsToIgnore: 4,
    maxColWidth: Infinity,
  });
  const filename = `${title}.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  workbook.xlsx.write(res).then(() => {
    res.end();
  });
};

export default handler;
