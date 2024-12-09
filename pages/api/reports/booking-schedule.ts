import ExcelJS from 'exceljs';
import getPrismaClient from 'lib/prisma';
import { Performance } from 'prisma/generated/prisma-client';
import {
  COLOR_HEXCODE,
  colorCell,
  colorTextAndBGAndItalicCell,
  colorTextAndBGCell,
  topAndBottomBorder,
} from 'services/salesSummaryService';
import { addWidthAsPerContent } from 'services/reportsService';
import { makeRowTextBoldAndAllignLeft } from './promoter-holds';
import { convertToPDF } from 'utils/report';
import { addBorderToAllCells } from 'utils/export';
import { bookingStatusMap } from 'config/bookings';
import { add, parseISO } from 'date-fns';
import {
  calculateWeekNumber,
  dateTimeToTime,
  formatDate,
  getDateDaysAway,
  getDifferenceInDays,
  newDate,
  timeFormat,
} from 'services/dateService';
import {
  PerformanceInfo,
  ScheduleViewFormatted,
  getBookingByKey,
  getNextConfirmedBooking,
  isOtherDayType,
} from 'services/reports/schedule-report';
import { group, isEmpty, sum } from 'radash';
import { getProductionWithContent } from 'services/productionService';

const addHeaderWithFilters = (worksheet, { title, from, to, status }) => {
  let headerRowsLength = 4;
  worksheet.addRow([title]);
  worksheet.addRow([]);
  if (from) {
    worksheet.addRow([`Start Date: ${formatDate(from, 'yyyy-MM-dd')}`]);
    headerRowsLength++;
  }
  if (to) {
    worksheet.addRow([`End Date: ${formatDate(to, 'yyyy-MM-dd')}`]);
    headerRowsLength++;
  }
  if (status) {
    worksheet.addRow([`Status: ${status === 'all' ? 'All' : bookingStatusMap[status]}`]);
    headerRowsLength++;
  }
  firstRowFormatting({ worksheet });
  return headerRowsLength;
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

const getKey = ({ FullProductionCode, ShowName, EntryDate }) => `${FullProductionCode} - ${ShowName} - ${EntryDate}`;

const handler = async (req, res) => {
  const { ProductionId, startDate: from, endDate: to, status, format } = req.body || {};

  if (!from || !to || !ProductionId) {
    res.status(400).json({ err: 'Prameters missing' });
  }

  const formatedFromDate = new Date(from);
  const formatedToDate = new Date(to);
  try {
    const prisma = await getPrismaClient(req);
    // Construct the Prisma query
    const data = await prisma.scheduleView.findMany({
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

    let maxNumOfPerformances = 0;
    performances.forEach((performance) => {
      const { Id, BookingId, Time, Date: performanceDate } = performance;
      const formattedDate = formatDate(performanceDate.getTime(), 'yyyy-MM-dd');
      const key = `${BookingId}/${formattedDate}`;
      if (!bookingIdPerformanceMap[key]) {
        bookingIdPerformanceMap[key] = [];
      }
      bookingIdPerformanceMap[key].push({
        performanceId: Id,
        performanceTime: Time ? dateTimeToTime(Time.getTime()) : null,
        performanceDate: performanceDate ? performanceDate.toISOString() : null,
      });
      if (bookingIdPerformanceMap[key].length > maxNumOfPerformances) {
        maxNumOfPerformances = bookingIdPerformanceMap[key].length;
      }
    });

    const workbook = new ExcelJS.Workbook();
    const formattedData = data.map((x) => ({
      ...x,
      EntryDate: formatDate(x.EntryDate.getTime(), 'yyyy-MM-dd'),
      ProductionStartDate: formatDate(x.ProductionStartDate.getTime(), 'yyyy-MM-dd'),
      ProductionEndDate: formatDate(x.ProductionEndDate.getTime(), 'yyyy-MM-dd'),
    }));

    const worksheet = workbook.addWorksheet('Travel Summary', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
      views: [{ state: 'frozen', xSplit: 0, ySplit: 7 }],
    });

    if (!formattedData?.length) {
      const productionDetails = await getProductionWithContent(ProductionId, req);
      const showName = productionDetails?.Show?.Name || '';
      const productionCode = productionDetails?.Code || '';
      const showCode = productionDetails?.Show?.Code || '';
      const filename = `${productionCode} ${showName} Holds and Comps`;
      const title = `${showCode}${productionCode} ${showName} Travel Summary - ${formatDate(newDate(), 'dd.MM.yy')}`;
      const headerRowsLength = addHeaderWithFilters(worksheet, {
        title,
        from: from ? formatedFromDate : null,
        to: to ? formatedToDate : null,
        status,
      });
      worksheet.addRow(['', '', '', '', '', '', '', 'Onward Travel']);
      worksheet.addRow(['Day', 'Date', 'Week', 'Venue', 'Town', 'Day Type', 'Status', 'Time', 'Miles']);
      for (let row = 2; row <= headerRowsLength; row++) {
        styleHeader({ worksheet, row, numberOfColumns: 9 });
      }
      for (let row = 1; row <= headerRowsLength; row++) {
        makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns: 9 });
      }
      worksheet.addRow([]);
      addBorderToAllCells({ worksheet });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      await workbook.xlsx.write(res).then(() => {
        res.end();
      });
      return;
    }

    const { ShowName, FullProductionCode, ProductionStartDate } = data[0];
    const title = `${FullProductionCode} ${ShowName} Travel Summary - ${formatDate(newDate(), 'dd.MM.yy')}`;
    const headerRowsLength = addHeaderWithFilters(worksheet, {
      title,
      from: from ? formatedFromDate : null,
      to: to ? formatedToDate : null,
      status,
    });

    const performanceTimeCols = new Array(maxNumOfPerformances).fill(0).map((_, i) => `Perf ${i + 1}`);
    const blankPerformances = new Array(maxNumOfPerformances).fill('');
    worksheet.addRow(['', '', '', '', '', '', '', ...blankPerformances, 'Onward Travel']);
    worksheet.addRow([
      'Day',
      'Date',
      'Week',
      'Venue',
      'Town',
      'Day Type',
      'Status',
      ...performanceTimeCols,
      'Time',
      'Miles',
    ]);
    worksheet.addRow([]);

    const dataLookUp: Record<string, ScheduleViewFormatted[]> = group(formattedData, (x: ScheduleViewFormatted) =>
      getKey(x),
    );
    const daysDiff = getDifferenceInDays(from, to, null, null, true);
    let rowNo = 8;
    let prevProductionWeekNum = '';
    let lastWeekMetaInfo = {
      weekTotalPrinted: false,
      prevProductionWeekNum: '',
    };
    let time: number[] = [];
    let mileage: number[] = [];
    let totalTime: number[] = [];
    let totalMileage: number[] = [];
    for (let i = 1; i <= daysDiff; i++) {
      lastWeekMetaInfo = { ...lastWeekMetaInfo, weekTotalPrinted: false };
      const weekDay = formatDate(getDateDaysAway(from, i - 1), 'eeee');
      const dateInIncomingFormat = add(parseISO(from), { days: i - 1 });
      const formattedDate = formatDate(dateInIncomingFormat.getTime(), 'yyyy-MM-dd');
      const key = getKey({ FullProductionCode, ShowName, EntryDate: formattedDate });
      // empty object is added to make sure to add a row for the date even if there is no data
      const values = getBookingByKey(key, dataLookUp);
      const nextDayValue = getNextConfirmedBooking({
        index: i,
        fullProductionCode: FullProductionCode,
        showName: ShowName,
        startDate: from,
        dataLookUp,
        maxDays: daysDiff,
      });
      const weekNumber = calculateWeekNumber(newDate(ProductionStartDate.getTime()), dateInIncomingFormat.getTime());
      for (const value of values) {
        const isOtherDay = isOtherDayType(value?.EntryName);
        const isCancelled = value?.EntryStatusCode === 'X';
        const isSuspended = value?.EntryStatusCode === 'S';
        const isConfirmed = value?.EntryStatusCode === 'C';
        if (!value || isEmpty(value)) {
          worksheet.addRow([
            weekDay.substring(0, 3),
            formatDate(dateInIncomingFormat.getTime(), 'dd/MM/yy'),
            `${weekNumber}`,
          ]);
          colorTextAndBGCell({
            worksheet,
            row: rowNo + 1,
            col: 4,
            textColor: COLOR_HEXCODE.BLACK,
            cellColor: null,
          });
        } else {
          const {
            ProductionWeekNum,
            Location,
            EntryName,
            EntryType,
            EntryId,
            TimeMins,
            Mileage,
            EntryStatusCode,
            PencilNum,
          } = value || {};
          const { Location: nextDayLocation } = nextDayValue || {};
          const formattedTime = TimeMins ? timeFormat(Number(TimeMins)) : '';
          prevProductionWeekNum = ProductionWeekNum ? String(ProductionWeekNum) : prevProductionWeekNum;
          const performanceDayType = !isCancelled || !isSuspended ? 'Performance' : '';
          const dayType = isOtherDay ? EntryType : performanceDayType;
          const pencilNum = PencilNum ? `(${PencilNum})` : '';
          let row: (string | number)[] = [
            weekDay.substring(0, 3),
            formatDate(dateInIncomingFormat.getTime(), 'dd/MM/yy'),
            `${weekNumber}`,
            EntryName || '',
            Location || '',
            dayType,
            `${bookingStatusMap?.[EntryStatusCode] || ''} ${pencilNum}`,
          ];
          const performanceKey = `${EntryId}/${formattedDate}`;
          const performanceTimes = new Array(maxNumOfPerformances)
            .fill(0)
            .map((_, i) => bookingIdPerformanceMap?.[performanceKey]?.[i]?.performanceTime ?? '');
          row = [...row, ...performanceTimes];
          if (nextDayLocation !== Location && isConfirmed) {
            row.push(formattedTime);
            row.push(Number(Mileage));
            time.push(Number(TimeMins));
            mileage.push(Number(Mileage) || 0);
          }
          worksheet.addRow(row);
        }
        rowNo++;

        if (isOtherDay) {
          colorTextAndBGAndItalicCell({
            worksheet,
            row: rowNo,
            col: 4,
            textColor: COLOR_HEXCODE.YELLOW,
            cellColor: COLOR_HEXCODE.RED,
          });
        }
        if (isCancelled || isSuspended) {
          colorTextAndBGCell({
            worksheet,
            row: rowNo,
            col: 4,
            textColor: COLOR_HEXCODE.WHITE,
            cellColor: isSuspended ? COLOR_HEXCODE.PURPLE : COLOR_HEXCODE.BLACK,
          });
        }
        if (weekDay === 'Sunday') {
          worksheet.addRow([
            '',
            '',
            '',
            '',
            '',
            '',
            ...blankPerformances,
            `Production Week ${value?.ProductionWeekNum || prevProductionWeekNum || ''}`,
            timeFormat(sum(time)),
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
        '',
        '',
        ...blankPerformances,
        `Production Week ${lastWeekMetaInfo?.prevProductionWeekNum || ''}`,
        timeFormat(sum(time)),
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
      'PRODUCTION TOTALS',
      '',
      '',
      '',
      ...blankPerformances,
      timeFormat(sum(totalTime)),
      totalMileage.reduce((acc, m) => acc + Number(m || 0), 0),
    ]);
    rowNo++;
    makeRowBold({ worksheet, row: rowNo });
    topAndBottomBorder({ worksheet, row: rowNo, colFrom: 5, colTo: 7, borderStyle: 'double' });

    const numberOfColumns = worksheet.columnCount;
    worksheet.mergeCells('F3:G3');
    worksheet.mergeCells('A1:G1');
    worksheet.getColumn('A').width = 12;
    worksheet.getColumn('B').width = 12;
    worksheet.getColumn('C').alignment = { horizontal: 'right' };
    for (let char = 'H', i = 8; i <= numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
      worksheet.getColumn(char).alignment = { horizontal: 'right' };
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
    worksheet.getColumn('F').width = 12;
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
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error Creating Performance' });
  }
};

export default handler;
