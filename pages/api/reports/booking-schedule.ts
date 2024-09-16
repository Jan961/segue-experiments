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
import { makeRowTextBoldAndAllignLeft } from './promoter-holds';
import { convertToPDF } from 'utils/report';
import { addBorderToAllCells } from 'utils/export';
import { bookingStatusMap } from 'config/bookings';

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

const handler = async (req, res) => {
  const { ProductionId, startDate: from, endDate: to, status, format } = req.body || {};

  if (!from || !to || !ProductionId) {
    throw new Error('Params are missing');
  }

  const formatedFromDate = new Date(from);
  const formatedToDate = new Date(to);

  // Construct the Prisma query
  const data: SCHEDULE_VIEW[] = await prisma.scheduleView.findMany({
    where: {
      AND: [
        {
          EntryDate: {
            gte: formatedFromDate,
            lte: formatedToDate,
          },
        },
        {
          ProductionId,
        },
        status && status !== 'all'
          ? {
              EntryStatusCode: status,
            }
          : {},
      ],
    },
    orderBy: {
      EntryDate: 'asc',
    },
  });

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
  let headerRowsLength = 4;
  worksheet.addRow([title]);
  worksheet.addRow([]);
  if (from) {
    worksheet.addRow([`Start Date: ${moment(formatedFromDate).format('YYYY-MM-DD')}`]);
    headerRowsLength++;
  }
  if (to) {
    worksheet.addRow([`End Date: ${moment(formatedToDate).format('YYYY-MM-DD')}`]);
    headerRowsLength++;
  }
  if (status) {
    worksheet.addRow([`Status: ${status === 'all' ? 'All' : bookingStatusMap[status]}`]);
    headerRowsLength++;
  }

  worksheet.addRow(['', '', '', '', '', 'Onward Travel']);
  worksheet.addRow(['Day', 'Date', 'Week', 'Venue', 'Town', 'Time', 'Miles']);
  worksheet.addRow([]);

  const map: { [key: string]: SCHEDULE_VIEW } = formattedData.reduce((acc, x) => ({ ...acc, [getKey(x)]: x }), {});
  const daysDiff = moment(to).diff(moment(from), 'days');
  let rowNo = 8;
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
    const weekDay = moment(moment(from).add(i - 1, 'day')).format('dddd');
    const nextDate = moment(moment(from).add(i, 'day'));
    const dateInIncomingFormat = moment(moment(from).add(i - 1, 'day'));
    const key = getKey({ FullProductionCode, ShowName, EntryDate: dateInIncomingFormat.format('YYYY-MM-DD') });
    const nextDayKey = getKey({ FullProductionCode, ShowName, EntryDate: nextDate.format('YYYY-MM-DD') });
    const value: SCHEDULE_VIEW = map[key];
    const nextDayValue: SCHEDULE_VIEW = map[nextDayKey];

    if (!value) {
      worksheet.addRow([weekDay.substring(0, 3), dateInIncomingFormat.format('DD/MM/YY'), `${prevProductionWeekNum}`]);
      colorTextAndBGCell({
        worksheet,
        row: rowNo + 1,
        col: 4,
        textColor: COLOR_HEXCODE.BLACK,
        cellColor: null,
      });
    } else {
      const { ProductionWeekNum, Location, EntryName, TimeMins, Mileage } = value || {};
      const { Location: nextDayLocation } = nextDayValue || {};
      const formattedTime = TimeMins ? minutesInHHmmFormat(Number(TimeMins)) : '';
      time.push(formattedTime || '00:00');
      mileage.push(Number(Mileage) || 0);
      prevProductionWeekNum = ProductionWeekNum ? String(ProductionWeekNum) : prevProductionWeekNum;

      worksheet.addRow([
        weekDay.substring(0, 3),
        dateInIncomingFormat.format('DD/MM/YY'),
        `${ProductionWeekNum}`,
        EntryName || '',
        Location || '',
        ...((nextDayLocation !== Location && [formattedTime, Number(Mileage) || '']) || []),
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
    console.table(lastWeekMetaInfo);
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

  worksheet.getColumn('C').alignment = { horizontal: 'right' };
  worksheet.getColumn('F').alignment = { horizontal: 'right' };
  worksheet.getColumn('G').alignment = { horizontal: 'right' };

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
  firstRowFormatting({ worksheet });
  for (let row = 2; row <= headerRowsLength; row++) {
    styleHeader({ worksheet, row, numberOfColumns });
  }
  for (let row = 1; row <= headerRowsLength; row++) {
    makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns });
  }
  addBorderToAllCells({ worksheet });
  worksheet.getCell(1, 1).font = { size: 16, color: { argb: COLOR_HEXCODE.WHITE }, bold: true };

  const filename = `${title}`;
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
    res.setHeader('Content-Disposition', `attachment; filename="${title}.pdf"`);
    res.end(pdf);
  }
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
  workbook.xlsx.write(res).then(() => {
    res.end();
  });
};

export default handler;
