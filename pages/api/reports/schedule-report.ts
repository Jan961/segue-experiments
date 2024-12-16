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
import {
  PerformanceInfo,
  ScheduleViewFormatted,
  getBookingByKey,
  getNextConfirmedBooking,
  getSheduleReport,
  isOtherDayType,
} from 'services/reports/schedule-report';
import { group, isEmpty, sum } from 'radash';
import {
  areDatesSame,
  calculateWeekNumber,
  formatDate,
  getDateDaysAway,
  getDifferenceInDays,
  getTimeFormattedFromDateTime,
  newDate,
  timeFormat,
} from 'services/dateService';

const makeRowBold = ({ worksheet, row }: { worksheet: any; row: number }) => {
  worksheet.getRow(row).font = { bold: true };
};

/**
 * firstRowFormatting is used to format the first row of the report with bold and left aligned text which generally contains the title of the report wth
 * @param param0
 */
const firstRowFormatting = ({ worksheet }: { worksheet: any }) => {
  worksheet.getRow(1).font = { bold: true, size: 16 };
  worksheet.getRow(1).alignment = { horizontal: 'left' };
};

/**
 *  Styles the header row of the report with bold and center aligned text
 * @param param0
 */
const styleHeader = ({ worksheet, row, numberOfColumns }: { worksheet: any; row: number; numberOfColumns: number }) => {
  for (let col = 1; col <= numberOfColumns; col++) {
    const cell = worksheet.getCell(row, col);
    cell.font = { bold: true };
    cell.alignment = { horizontal: 'center' };
  }
};

/**
 * Returns the key for the given data which is used to group the data by the key
 * @param param0
 * @returns
 */
const getKey = ({ FullProductionCode, ShowName, EntryDate }) => `${FullProductionCode} - ${ShowName} - ${EntryDate}`;

/**
 * Creates schedule report for the given production, start date, end date and status
 * @param req
 * @param res
 * @returns
 */
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

    // Fetch data from the scheduleview based on the given parameters
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

    // Fetch performances for the bookingIds from the scheduleview data
    const performances: Performance[] = await prisma.performance.findMany({
      where: {
        BookingId: {
          in: bookingIdList,
        },
      },
    });

    // create a map of bookingId to performances for easy access while creating report
    performances.forEach((performance) => {
      const { Id, BookingId, Time, Date: performanceDate } = performance;

      if (!bookingIdPerformanceMap[BookingId]) {
        bookingIdPerformanceMap[BookingId] = [];
      }

      bookingIdPerformanceMap[BookingId].push({
        performanceId: Id,
        performanceTime: Time ? getTimeFormattedFromDateTime(Time.getTime()) : null,
        performanceDate: performanceDate ? performanceDate.toISOString() : null,
      });
    });

    // Format the data to the required format. This is mainly to format the date to the required format
    const formattedData = data.map((x) => ({
      ...x,
      EntryDate: formatDate(x.EntryDate.getTime(), 'yyyy-MM-dd'),
      ProductionStartDate: formatDate(x.ProductionStartDate.getTime(), 'yyyy-MM-dd'),
      ProductionEndDate: formatDate(x.ProductionEndDate.getTime(), 'yyyy-MM-dd'),
    }));

    // Create a new excel workbook
    const workbook = new ExcelJS.Workbook();

    // Create a new worksheet with the given name and set the page setup and views for the worksheet
    const worksheet = workbook.addWorksheet('Tour Schedule', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
      views: [{ state: 'frozen', xSplit: 0, ySplit: 7 }],
    });

    // If there is no data for the given parameters then return the empty excel file
    if (!formattedData?.length) {
      const filename = 'Booking Report.xlsx';
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      await workbook.xlsx.write(res).then(() => {
        res.end();
      });
      return;
    }

    const { ShowName, FullProductionCode, ProductionStartDate } = data[0];
    const title = `${FullProductionCode} ${ShowName} Tour Schedule - ${formatDate(newDate(), 'dd.MM.yy')}`;
    let headerRowsLength = 4;

    // add the title and the date of the report to the header
    worksheet.addRow([title]);
    worksheet.addRow([`Exported: ${formatDate(newDate(), 'dd/MM/yy H:mm')} - Layout: Standard`]);

    // Add the start date, end date and status to the report header
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

    // Add the header row for the report with the column names
    // header has two rows with column names split into two rows
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

    // Group the data by the key (FullProductionCode, ShowName, EntryDate) so that we can easily access the data for a particular day
    // Note: each key will have multiple values as there can be multiple pencilled bookings for a particular day
    const map: Record<string, ScheduleViewFormatted[]> = group(formattedData, (x: ScheduleViewFormatted) => getKey(x));
    // Calculate the difference in days between the start and end date of the production to loop through each day and add row for each day
    const daysDiff = getDifferenceInDays(from, to, null, null, true);
    // Initialize the row number to 8 as the first 7 rows are for the header
    let rowNo = 8;
    let prevProductionWeekNum = '';

    // lastWeekMetaInfo is used to keep track of the previous week number and if the total for the week has been printed
    let lastWeekMetaInfo = {
      weekTotalPrinted: false,
      prevProductionWeekNum: '',
    };

    // Initialize the arrays to store the total time, mileage, seats and performances per week
    const time: number[] = [];
    const mileage: number[] = [];

    // Initialize the arrays to store the total time, mileage, seats and performances for the production for all days
    let totalTime: number[] = [];
    let totalMileage: number[] = [];
    const seats: number[] = [];
    const performancesPerDay: number[] = [];

    // Loop through each day and add row for each day
    // Note: same day can have multiple rows in report as there can be multiple pencilled bookings for a particular day
    for (let i = 1; i <= daysDiff; i++) {
      lastWeekMetaInfo = { ...lastWeekMetaInfo, weekTotalPrinted: false };
      const weekDay = formatDate(getDateDaysAway(from, i - 1), 'eeee');
      const dateInIncomingFormat = getDateDaysAway(from, i - 1);
      const key = getKey({ FullProductionCode, ShowName, EntryDate: formatDate(dateInIncomingFormat, 'yyyy-MM-dd') });

      // Get the values for the given day
      const values = getBookingByKey(key, map);

      // Get the next confirmed booking for the given day to make a decision on whether to print mileage and time for the day
      // mileage and time should be printed only for the last day of the confirmed booking for same consecutive bookings
      const nextValue = getNextConfirmedBooking({
        index: i,
        fullProductionCode: FullProductionCode,
        showName: ShowName,
        startDate: from,
        dataLookUp: map,
        maxDays: daysDiff,
      });

      // Calculate the week number for the given date
      const weekNumber = calculateWeekNumber(newDate(ProductionStartDate.getTime()), dateInIncomingFormat.getTime());
      for (const value of values) {
        const isOtherDay = isOtherDayType(value?.EntryName);

        // EntryStatusCode 'X' is for cancelled bookings and 'S' is for suspended bookings and 'C' is for confirmed bookings
        const isCancelled = value?.EntryStatusCode === 'X';
        const isSuspended = value?.EntryStatusCode === 'S';
        const isConfirmed = value?.EntryStatusCode === 'C';

        // If there is no value for the given day then add a row with the day details
        if (!value || isEmpty(value)) {
          worksheet.addRow([
            FullProductionCode,
            weekDay.substring(0, 3),
            formatDate(dateInIncomingFormat, 'dd/MM/yy'),
            weekNumber ?? prevProductionWeekNum,
          ]);
          colorTextAndBGCell({
            worksheet,
            row: rowNo + 1,
            col: 5,
            textColor: COLOR_HEXCODE.BLACK,
            cellColor: COLOR_HEXCODE.WHITE,
          });
        } else {
          // If there is a value for the given day then add a row with the booking details
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

          // Get the performances for the given bookingId for the given day
          const performancesOnThisDay = performances?.filter?.((performance) =>
            areDatesSame(performance.performanceDate, dateInIncomingFormat),
          );

          // Update the prevProductionWeekNum if the ProductionWeekNum is not null
          prevProductionWeekNum = ProductionWeekNum ? String(ProductionWeekNum) : prevProductionWeekNum;
          let row = [
            FullProductionCode,
            weekDay.substring(0, 3),
            formatDate(dateInIncomingFormat, 'dd/MM/yy'),
            weekNumber ?? ProductionWeekNum,
            EntryName || '',
          ];
          if (isOtherDay) {
            // If the day is other day then add the location and entry type to the row
            row = row.concat([Location || '', EntryType || '']);
          } else if (!isCancelled && !isSuspended) {
            // If the day is not cancelled or suspended then add the location, entry type, number of performances, performance times to the row
            // if next day location is different from the current day location then it is the last day of the run of dates for a booking
            const isFinalDay = nextValue?.Location !== value?.Location;
            const bookingStatus = bookingStatusMap?.[EntryStatusCode] || '';
            const pencilNum = PencilNum ? `(${PencilNum})` : '';
            row = row.concat([
              Location || '',
              'Performance',
              bookingStatus + ' ' + pencilNum,
              VenueSeats,
              performancesOnThisDay?.length,
              performancesOnThisDay?.[0]?.performanceTime || '',
              performancesOnThisDay?.[1]?.performanceTime || '',
            ]);
            seats.push(Number(VenueSeats) || 0);
            performancesPerDay.push(performancesOnThisDay?.length || 0);
            if (isFinalDay && isConfirmed) {
              // If the day is the last day of the run of dates for a booking then add mileage and time to the row
              row = row.concat([Number(Mileage) || '', formattedTime]);
              // add the mileage and time to the total mileage and time arrays which can be used for calculating totals at the end
              time.push(Number(TimeMins) || 0);
              mileage.push(Number(Mileage) || 0);
            }
          } else {
            // If the day is cancelled or suspended then add the location and status to the row
            //  we shouldnt add mileage and time for cancelled or suspended bookings
            const bookingStatus = bookingStatusMap?.[EntryStatusCode] || '';
            const pencilNum = PencilNum ? `(${PencilNum})` : '';
            row = row.concat([Location || '', 'Performance', bookingStatus + ' ' + pencilNum]);
          }
          worksheet.addRow([...row]);
        }
        rowNo++;

        if (isOtherDay) {
          // If the day is other day then color the venue cell with yellow color text and red background
          colorTextAndBGCell({
            worksheet,
            row: rowNo,
            col: 5,
            textColor: COLOR_HEXCODE.YELLOW,
            cellColor: COLOR_HEXCODE.RED,
          });
        }
        if (isCancelled || isSuspended) {
          // if the day is cancelled then color the venue cell with white color text and black background
          // if the day is suspended then color the venue cell with white color text and purple background
          colorTextAndBGCell({
            worksheet,
            row: rowNo,
            col: 5,
            textColor: COLOR_HEXCODE.WHITE,
            cellColor: isSuspended ? COLOR_HEXCODE.PURPLE : COLOR_HEXCODE.BLACK,
          });
        }
        if (weekDay === 'Monday') {
          // If the day is Monday then color the row with cream
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

    // Add the production totals to the report
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
    //  production  totals row should be bold and have double border
    makeRowBold({ worksheet, row: rowNo });
    const numberOfColumns = worksheet.columnCount;
    topAndBottomBorder({ worksheet, row: rowNo, colFrom: 5, colTo: numberOfColumns, borderStyle: 'double' });

    worksheet.mergeCells('F3:G3');
    worksheet.mergeCells('A1:G1');

    // Set the width for the columns and align the text in the columns as required
    for (let char = 'A', i = 0; i <= numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
      if (char === 'A' || char === 'B') {
        worksheet.getColumn(char).width = 12;
      } else {
        worksheet.getColumn(char).width = 20;
        alignColumnTextHorizontally({ worksheet, colAsChar: char, align: 'center' });
      }
    }

    firstRowFormatting({ worksheet });
    // style the header rows
    for (let row = 2; row <= headerRowsLength; row++) {
      styleHeader({ worksheet, row, numberOfColumns });
    }

    // make header rows left aligned and bold
    for (let row = 1; row <= headerRowsLength; row++) {
      makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns });
    }

    // Add width of each column as per max content in all of its cells
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

    // even after setting width as per content sometime the width is not set properly so setting the width manually for some of constant width columns
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

    // add border to all cells
    addBorderToAllCells({ worksheet });

    // make the title bold and left aligned and size of 16
    worksheet.getCell(1, 1).font = { size: 16, color: { argb: COLOR_HEXCODE.WHITE }, bold: true };
    const filename = `${title}.xlsx`;

    // If the format is pdf then convert the workbook to pdf and send the pdf as response
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

    // If the format is not pdf then send the excel file as response
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
