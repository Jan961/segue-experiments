import { Performance } from 'prisma/generated/prisma-client';
import ExcelJS from 'exceljs';
import getPrismaClient from 'lib/prisma';
import {
  COLOR_HEXCODE,
  alignColumnTextHorizontally,
  colorCell,
  colorTextAndBGCell,
  topAndBottomBorder,
} from 'services/salesSummaryService';
import { addWidthAsPerContent } from 'services/reportsService';
import { makeRowTextBoldAndAllignLeft } from './promoter-holds';
import { convertToPDF } from 'utils/report';
import { bookingStatusMap } from 'config/bookings';
import { addBorderToAllCells } from 'utils/export';
import { PerformanceInfo, SCHEDULE_VIEW, getSheduleReport } from 'services/reports/schedule-report';
import { sum } from 'radash';
import {
  formatDate,
  getDateDaysAway,
  getDifferenceInDays,
  getTimeFormattedFromDateTime,
  newDate,
  timeFormat,
} from 'services/dateService';
import { isSameDay } from 'date-fns';

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

const getKey = ({ FullProductionCode, ShowName, EntryDate }) => `${FullProductionCode} - ${ShowName} - ${EntryDate}`;

const handler = async (req, res) => {
  try {
    const prisma = await getPrismaClient(req);
    const { ProductionId, startDate: from, endDate: to, status, format } = req.body;

    if (format === 'json') {
      const data = await getSheduleReport({ from, to, status, ProductionId }, req);
      res.status(200).json(data);
      return;
    }

    const formatedFromDate = new Date(from);
    const formatedToDate = new Date(to);

    if (!ProductionId) {
      throw new Error('Params are missing');
    }

    // Construct the Prisma query
    const data = await prisma.scheduleView.findMany({
      where: {
        AND: [
          from && to
            ? {
                EntryDate: {
                  gte: formatedFromDate,
                  lte: formatedToDate,
                },
              }
            : {},
          ProductionId
            ? {
                ProductionId,
              }
            : {},
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
    const bookingIdPerformanceMap: Record<number, PerformanceInfo[]> = {};
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
        performanceTime: Time ? getTimeFormattedFromDateTime(Time.getTime()) : null,
        performanceDate: Date ? Date.toISOString() : null,
      });
    });

    const workbook = new ExcelJS.Workbook();
    const formattedData = data.map((x) => ({
      ...x,
      EntryDate: formatDate(x.EntryDate.getTime(), 'yyyy-MM-dd'),
      ProductionStartDate: formatDate(x.ProductionStartDate.getTime(), 'yyyy-MM-dd'),
      ProductionEndDate: formatDate(x.ProductionEndDate.getTime(), 'yyyy-MM-dd'),
    }));

    const worksheet = workbook.addWorksheet('Tour Schedule', {
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
    const title = `${FullProductionCode} ${ShowName} Tour Schedule - ${formatDate(newDate(), 'dd.MM.yy')}`;
    let headerRowsLength = 4;
    worksheet.addRow([title]);
    worksheet.addRow([`Exported: ${formatDate(newDate(), 'dd/MM/yy H:mm')} - Layout: Standard`]);

    if (from) {
      worksheet.addRow([`Start Date: ${formatDate(formatedFromDate.getTime(), 'yyyy-MM-dd')}`]);
      headerRowsLength++;
    }

    if (to) {
      worksheet.addRow([`End Date: ${formatDate(formatedToDate.getTime(), 'yyyy-MM-dd')}`]);
      headerRowsLength++;
    }

    if (status) {
      worksheet.addRow([`Status: ${status === 'all' ? 'All' : bookingStatusMap[status]}`]);
      headerRowsLength++;
    }

    worksheet.addRow(['', '', '', '', '', '', '', 'BOOKING', '', 'PERFS', 'PERF1', 'PERF2', '']);
    worksheet.addRow([
      'PROD',
      'DAY',
      'DATE',
      'WK',
      'VENUE/DETAILS',
      'TOWN',
      'DAY TYPE',
      'STATUS',
      'CAPACITY',
      'DAY',
      'TIME',
      'TIME',
      'MILES',
      'TIME',
    ]);
    worksheet.addRow([]);

    const map: { [key: string]: SCHEDULE_VIEW } = formattedData.reduce((acc, x) => ({ ...acc, [getKey(x)]: x }), {});
    const daysDiff = getDifferenceInDays(from, to, null, null, true);
    let rowNo = 8;
    let prevProductionWeekNum = '';
    let lastWeekMetaInfo = {
      weekTotalPrinted: false,
      prevProductionWeekNum: '',
    };
    const time: number[] = [];
    const mileage: number[] = [];
    let totalTime: number[] = [];
    let totalMileage: number[] = [];
    const seats: number[] = [];
    const performancesPerDay: number[] = [];

    for (let i = 1; i <= daysDiff; i++) {
      lastWeekMetaInfo = { ...lastWeekMetaInfo, weekTotalPrinted: false };
      const weekDay = formatDate(getDateDaysAway(from, i - 1), 'eeee');
      const dateInIncomingFormat = getDateDaysAway(from, i - 1);
      const nextDateIncomingFormat = getDateDaysAway(from, i);
      const key = getKey({ FullProductionCode, ShowName, EntryDate: formatDate(dateInIncomingFormat, 'yyyy-MM-dd') });
      const nextKey = getKey({
        FullProductionCode,
        ShowName,
        EntryDate: formatDate(nextDateIncomingFormat, 'yyyy-MM-dd'),
      });
      const value: SCHEDULE_VIEW = map[key];
      const nextValue: SCHEDULE_VIEW = map[nextKey];
      const isOtherDay = [
        'Day Off',
        'Travel Day',
        'Get-In / Fit-Up Day',
        'Tech / Dress Day',
        'Rehearsal Day',
        'Declared Holiday',
      ].includes(value?.EntryName);
      const isCancelled = value?.EntryStatusCode === 'X';
      const isSuspended = value?.EntryStatusCode === 'S';
      if (!value) {
        worksheet.addRow([
          FullProductionCode,
          weekDay.substring(0, 3),
          formatDate(dateInIncomingFormat, 'dd/MM/yy'),
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
        const {
          ProductionWeekNum,
          Location,
          EntryName,
          TimeMins,
          Mileage,
          VenueSeats,
          EntryId,
          PencilNum,
          EntryStatusCode,
          EntryType = '',
        } = value;
        const formattedTime = TimeMins ? timeFormat(Number(TimeMins)) : '';
        const performances = bookingIdPerformanceMap[EntryId];
        const performancesOnThisDay = performances?.filter?.((performance) =>
          isSameDay(newDate(performance.performanceDate).getTime(), dateInIncomingFormat),
        );
        prevProductionWeekNum = ProductionWeekNum ? String(ProductionWeekNum) : prevProductionWeekNum;
        let row = [
          FullProductionCode,
          weekDay.substring(0, 3),
          formatDate(dateInIncomingFormat, 'dd/MM/yy'),
          ProductionWeekNum,
          EntryName || '',
        ];
        if (isOtherDay) {
          row = row.concat([Location || '', EntryType || '']);
        } else if (!isCancelled && !isSuspended) {
          const isFinalDay = nextValue?.Location !== value?.Location;
          row = row.concat([
            Location || '',
            'Performance',
            `${bookingStatusMap?.[EntryStatusCode] || ''} ${PencilNum ? `(${PencilNum})` : ''}`,
            VenueSeats,
            performancesOnThisDay?.length,
            performancesOnThisDay?.[0]?.performanceTime || '',
            performancesOnThisDay?.[1]?.performanceTime || '',
          ]);
          seats.push(Number(VenueSeats) || 0);
          performancesPerDay.push(performancesOnThisDay?.length || 0);
          if (isFinalDay) {
            row = row.concat([Number(Mileage) || '', formattedTime]);
            time.push(Number(TimeMins) || 0);
            mileage.push(Number(Mileage) || 0);
          }
        } else {
          row = row.concat([
            Location || '',
            'Performance',
            `${bookingStatusMap?.[EntryStatusCode] || ''} ${PencilNum ? `(${PencilNum})` : ''}`,
            // VenueSeats,
            // performancesOnThisDay?.length,
            // performancesOnThisDay?.[0]?.performanceTime || '',
            // performancesOnThisDay?.[1]?.performanceTime || '',
          ]);
        }
        worksheet.addRow([...row]);
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
      if (isCancelled || isSuspended) {
        colorTextAndBGCell({
          worksheet,
          row: rowNo,
          col: 5,
          textColor: COLOR_HEXCODE.WHITE,
          cellColor: isSuspended ? COLOR_HEXCODE.PURPLE : COLOR_HEXCODE.BLACK,
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
      '',
      seats.reduce((acc, m) => acc + Number(m || 0), 0),
      sum(performancesPerDay),
      '',
      '',
      totalMileage.reduce((acc, m) => acc + Number(m || 0), 0),
      timeFormat(sum(totalTime)),
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
    for (let row = 2; row <= headerRowsLength; row++) {
      styleHeader({ worksheet, row, numberOfColumns });
    }
    worksheet.getCell(1, 1).font = { size: 20, color: { argb: COLOR_HEXCODE.WHITE }, bold: true };

    for (let row = 1; row <= headerRowsLength; row++) {
      makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns });
    }

    addWidthAsPerContent({
      worksheet,
      fromColNumber: 1,
      toColNumber: numberOfColumns,
      startingColAsCharWIthCapsOn: 'B',
      minColWidth: 10,
      bufferWidth: 0,
      rowsToIgnore: 2,
      maxColWidth: Infinity,
    });

    worksheet.getColumn('A').width = 7;
    worksheet.getColumn('B').width = 5;
    worksheet.getColumn('C').width = 12;
    worksheet.getColumn('D').width = 5;
    worksheet.getColumn('G').width = 15;
    worksheet.getColumn('I').width = 5;
    worksheet.getColumn('J').width = 7;
    worksheet.getColumn('K').width = 7;
    worksheet.getColumn('L').width = 7;
    worksheet.getColumn('M').width = 7;
    addBorderToAllCells({ worksheet });
    worksheet.getCell(1, 1).font = { size: 16, color: { argb: COLOR_HEXCODE.WHITE }, bold: true };
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
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

export default handler;
