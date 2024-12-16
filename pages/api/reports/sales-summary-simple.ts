import ExcelJS from 'exceljs';
import getPrismaClient from 'lib/prisma';
import {
  COLOR_HEXCODE,
  alignCellTextRight,
  assignBackgroundColor,
  calculateCurrVSPrevWeekValue,
  colorCell,
  getChangeVsLastWeekValue,
  getCurrencyWiseTotal,
  getValuesFromObject,
  getWeekWiseGrandTotalInPound,
  handleAddingWeeklyTotalRow,
  makeRowTextBold,
  makeRowTextBoldAndALignCenter,
  makeTextBoldOfNRows,
  CONSTANTS,
  formatWeek,
  LEFT_PORTION_KEYS,
  getSeatsColumnForWeekTotal,
  getSeatsDataForTotal,
  makeColumnTextBold,
  makeCellTextBold,
  salesReportName,
  addCellBorder,
  makeRowTextNormal,
  applyFormattingToRange,
  colorTextAndBGCell,
} from 'services/salesSummaryService';
import {
  BOOK_STATUS_CODES,
  SALES_TYPE_NAME,
  TRequiredFieldsFinalFormat,
  TSalesView,
  TotalForSheet,
  VENUE_CURRENCY_SYMBOLS,
  WeekAggregateSeatsDetail,
  WeekAggregates,
} from 'types/SalesSummaryTypes';
import { addWidthAsPerContent } from 'services/reportsService';
import { NextApiRequest, NextApiResponse } from 'next';

import { ALIGNMENT, styleHeader } from './masterplan';
import { currencyCodeToSymbolMap } from 'config/Reports';
import { convertToPDF, getWeeksBetweenDates, sanitizeRowData } from 'utils/report';
import { calculateWeekNumber, compareDatesWithoutTime, formatDate, getKey } from 'services/dateService';
import { group, select, unique } from 'radash';
import { addBorderToAllCells, getExportedAtTitle } from 'utils/export';
import { SalesSummaryView, ScheduleView } from 'prisma/generated/prisma-client';
import { all } from 'axios';

interface ProductionWeek {
  mondayDate: string;
  productionWeekNum: string;
}

interface ProductionSummary {
  FullProductionCode: string;
  ShowName: string;
  ProductionWeekNum: number;
  StartDate: Date;
  EndDate: Date;
  Venue: string;
  Town: string;
  VenueCurrencyCode: string;
  VenueCurrencySymbol: VENUE_CURRENCY_SYMBOLS;
  BookingId: number;
  BookingFirstDate: Date;
  BookingStatusCode: BOOK_STATUS_CODES;
  Week: string;
  Day: string;
  Date: Date;
  ConversionRate: number;
  Value: number;
  FormattedFinalFiguresValue: number;
  NotOnSaleDate?: string;
  FinalSetSalesFiguresDate?: string;
}

let prisma = null;

const getScheduleKey = ({ FullProductionCode, BookingFirstDate }) => `${FullProductionCode} - ${BookingFirstDate}`;
/**
 *  Transforms raw schedule/booking data into a standardized format for reporting
 * @param {Object} params - The raw schedule/booking data
 * @param {string|Date} params.EntryDate - Date of the schedule entry
 * @param {number} params.ProductionWeekNum - Week number in production schedule
 * @param {string} params.EntryStatusCode - Status of the booking (e.g., 'C' for confirmed)
 * @param {number} params.EntryId - Unique identifier for the entry
 * @param {string|Date} params.ProductionStartDate - Start date of the production
 * @param {string|Date} params.ProductionEndDate - End date of the production
 * @param {string} [params.EntryName=''] - Name of the venue/entry
 * @param {string} [params.Location=''] - Town/city location
 * @returns
 */
const transformSummaryRow = ({
  EntryDate,
  ProductionWeekNum,
  EntryStatusCode,
  EntryId,
  ProductionStartDate,
  ProductionEndDate,
  EntryName = '',
  Location = '',
}) => ({
  Day: EntryDate ? formatDate(new Date(EntryDate).getTime(), 'eeee') : '',
  Week: formatWeek(ProductionWeekNum),
  Date: EntryDate,
  Town: Location,
  BookingStatusCode: EntryStatusCode,
  BookingId: EntryId,
  Venue: EntryName,
  StartDate: ProductionStartDate,
  EndDate: ProductionEndDate,
  BookingFirstDate: EntryDate,
});

/**
 * Retrieves schedule entries for a production ordered by date
 * @param productionId
 * @returns
 */
const getSchedule = async (productionId: number): Promise<ScheduleView[]> => {
  return prisma.scheduleView.findMany({
    where: {
      EntryType: 'Booking',
      ...(productionId && { ProductionId: productionId }),
    },
    orderBy: {
      EntryDate: 'asc',
    },
  });
};

/**
 * Retrieves and transforms general sales summary data for a production
 * Creates a map of sales data keyed by production code and booking date
 * @param productionId
 * @returns
 */
const getGeneralSalesSummary = async (productionId: number) => {
  const data: SalesSummaryView[] = await prisma.salesSummaryView.findMany({
    where: {
      SaleTypeName: SALES_TYPE_NAME.GENERAL_SALES,
      ...(productionId && {
        ProductionId: productionId,
      }),
    },
    orderBy: {
      EntryDate: 'asc',
    },
  });
  return data.reduce((summaryMap, salesSet) => {
    // Create lookup key for sales data
    // key is a combination of production code and booking date in 'yyyy-MM-dd' format
    const key = getScheduleKey({
      FullProductionCode: salesSet.FullProductionCode,
      BookingFirstDate: formatDate(salesSet.EntryDate.getTime(), 'yyyy-MM-dd'),
    });
    return {
      ...summaryMap,
      [key]: {
        ...salesSet,
        ...transformSummaryRow(salesSet),
        VenueCurrencySymbol: currencyCodeToSymbolMap[salesSet.VenueCurrencyCode],
        FormattedFinalFiguresValue: salesSet.Value?.toNumber?.() || 0,
      },
    };
  }, {});
};

/**
 * Fetches and combines booking schedule data with sales information for a production
 * @param productionId
 * @returns
 */
const fetchProductionBookings = async (productionId: number): Promise<ProductionSummary[]> => {
  const [salesData, schedule] = await all([getGeneralSalesSummary(productionId), getSchedule(productionId)]);
  const rows = unique(schedule as ScheduleView[], (entry: ScheduleView) => entry.EntryId)
    .map((entry) => {
      // Create lookup key for sales data
      // key is a combination of production code and booking date in 'yyyy-MM-dd' format
      const key = getScheduleKey({
        FullProductionCode: entry.FullProductionCode,
        BookingFirstDate: formatDate(entry.EntryDate.getTime(), 'yyyy-MM-dd'),
      });
      const sales = salesData[key] || {};
      // Combine schedule and sales data into a single row
      return {
        ...entry,
        ...transformSummaryRow(entry),
        ...sales,
      };
    })
    .sort((a, b) => new Date(a.EntryDate).getTime() - new Date(b.EntryDate).getTime());
  return rows;
};

/**
 * Transforms sales data into required format with currency and date formatting
 * Uses radash select for combined filter & map operation
 */
const transformSalesData = (data: TSalesView[]): TRequiredFieldsFinalFormat[] => {
  return select(
    data,
    (record) => {
      if (record.SaleTypeName !== SALES_TYPE_NAME.GENERAL_SALES) {
        return null;
      }
      const baseFields = {
        BookingId: record.BookingId,
        BookingProductionWeekNum: record.BookingProductionWeekNum,
        BookingFirstDate: record.BookingFirstDate,
        VenueTown: record.VenueTown,
        VenueName: record.VenueName,
        Value: record.Value?.toNumber?.(),
        VenueCurrencySymbol: currencyCodeToSymbolMap[record.VenueCurrencyCode],
        SetBookingWeekNum: record.SetBookingWeekNum,
        SetProductionWeekDate: record.SetProductionWeekDate,
        ConversionRate: record.ConversionRate,
        SetIsCopy: record.SetIsCopy,
        SetBrochureReleased: record.SetBrochureReleased,
        BookingStatusCode: record.BookingStatusCode,
        FinalFiguresValue: record.FinalFiguresValue?.toNumber?.(),
        TotalCapacity: record.TotalCapacity,
        Seats: record.Seats?.toNumber?.(),
        NotOnSalesDate: record.NotOnSalesDate,
        SetProductionWeekNum: record.SetProductionWeekNum,
      };

      return {
        ...baseFields,
        Week: formatWeek(baseFields.BookingProductionWeekNum),
        FormattedValue: baseFields.Value ? `${baseFields.VenueCurrencySymbol}${baseFields.Value}` : '',
        Value: baseFields.Value || 0,
        FormattedSetProductionWeekNum: formatWeek(baseFields.SetProductionWeekNum),
        FormattedFinalFiguresValue: baseFields.FinalFiguresValue || 0,
        Day: baseFields.BookingFirstDate ? formatDate(baseFields.BookingFirstDate, 'eeee') : '',
        Date: baseFields.BookingFirstDate,
        Town: baseFields.VenueTown,
        Venue: baseFields.VenueName,
        SetProductionWeekDate: baseFields.SetProductionWeekDate ? getKey(baseFields.SetProductionWeekDate) : '',
      };
    },
    (record) => record !== null && record.SaleTypeName === SALES_TYPE_NAME.GENERAL_SALES,
  );
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { productionId, fromWeek, toWeek, isWeeklyReport, isSeatsDataRequired, format, exportedAt } = req.body || {};
  try {
    prisma = await getPrismaClient(req);
    const bookings = await fetchProductionBookings(+productionId);
    const { StartDate, EndDate } = bookings?.[0] || {};
    const weeks: ProductionWeek[] = getWeeksBetweenDates(fromWeek, toWeek || EndDate).map((week) => {
      const weekNum = calculateWeekNumber(new Date(StartDate).getTime(), new Date(week.mondayDate).getTime());
      return {
        weekNum,
        productionWeekNum: formatWeek(weekNum),
        ...week,
      };
    });
    // Create a new Excel workbook
    const workbook = new ExcelJS.Workbook();
    // Fetch sales data for the production
    const data: TSalesView[] = await prisma.SalesView.findMany({
      where: {
        SaleTypeName: SALES_TYPE_NAME.GENERAL_SALES,
        ...(productionId && {
          ProductionId: productionId,
        }),
        ...(fromWeek &&
          toWeek && {
            SetProductionWeekDate: {
              gte: new Date(fromWeek),
              lte: new Date(toWeek),
            },
          }),
      },
    });

    // Filter out non-general sales data and map to required fields
    const finalFormattedValues: TRequiredFieldsFinalFormat[] = transformSalesData(data);
    // Group sales data by booking ID and production week date
    // This is used to lookup sales data for a specific booking and week in the final report
    const bookingSalesByWeek = group(
      finalFormattedValues,
      (value) => `${value.BookingId} ${value.SetProductionWeekDate}`,
    );

    // Write data to the worksheet
    const worksheet = workbook.addWorksheet('Sales Summary', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
      views: [{ state: 'frozen', xSplit: 5, ySplit: 6 }],
    });

    // Logic for headers
    const headerWeekNums: string[] = weeks.map((x) => x.productionWeekNum);
    const headerWeekDates: string[] = weeks.map((x) => x.mondayDate);

    // as this api serves three different reports, we need to identify the report name based on parameters
    const reportName = salesReportName({ isWeeklyReport, isSeatsDataRequired, data: bookings });
    const title = `${reportName} - ${formatDate(exportedAt, 'dd.MM.yy')}`;
    worksheet.addRow([title]);
    const exportedAtTitle = getExportedAtTitle(exportedAt);
    worksheet.addRow([exportedAtTitle]);
    worksheet.mergeCells('A2:D2');
    worksheet.addRow([]);

    // header columns names
    const columns: string[] = [
      'Production',
      '',
      '',
      '',
      '',
      ...headerWeekNums,
      CONSTANTS.CHANGE_VS,
      ...(isSeatsDataRequired ? [CONSTANTS.RUN_SEATS, CONSTANTS.RUN_SEATS, CONSTANTS.RUN_SALES] : []),
    ];
    worksheet.addRow(sanitizeRowData(columns));
    worksheet.addRow(
      sanitizeRowData([
        'Week',
        'Day',
        'Date',
        'Town',
        'Venue',
        ...headerWeekDates.map((week) => formatDate(week, 'dd/MM/yy')),
        'Last Week',
        ...(isSeatsDataRequired ? ['Sold', 'Capacity', 'vs Capacity'] : []),
      ]),
    );
    worksheet.addRow([]);

    // create a map of production week numbers to array of sales data for that week
    const totalForWeeks: WeekAggregates = headerWeekNums.reduce((acc, x) => ({ ...acc, [x]: [] }), {});

    // create a map of week numbers to array of sales data for that week
    let totalRowWeekWise: WeekAggregates = headerWeekNums.reduce((acc, x) => ({ ...acc, [x]: [] }), {});

    // create a map of currency symbols to array of sales data for that week
    let totalCurrencyAndWeekWiseSeatsTotal: WeekAggregateSeatsDetail = Object.values(VENUE_CURRENCY_SYMBOLS).reduce(
      (acc, symbol) => ({ ...acc, [symbol]: [] }),
      {},
    );

    // create a map of currency symbols to array of sales data for that currency
    const totalCurrencyWiseSeatsTotal: WeekAggregateSeatsDetail = Object.values(VENUE_CURRENCY_SYMBOLS).reduce(
      (acc, symbol) => ({ ...acc, [symbol]: [] }),
      {},
    );

    // number of columns for sales data
    const variableColsLength: number = headerWeekNums.length;
    let row = 7;

    let lastBookingWeek: string = finalFormattedValues?.[0]?.Week;
    let seatsData: {
      Seats?: number;
      TotalCapacity?: number;
      Percentage?: number;
      Currency?: TRequiredFieldsFinalFormat['VenueCurrencySymbol'];
    } = {};

    // Loop through each booking and write data to the worksheet
    bookings.forEach((booking) => {
      // if weekly report is enabled, check if the booking week has changed and add a total row
      if (isWeeklyReport) {
        if (lastBookingWeek !== booking.Week) {
          const rowsAdded: number = handleAddingWeeklyTotalRow({
            worksheet,
            headerWeekNums,
            totalRowWeekWise,
            lastBookingWeek,
            totalCurrencyAndWeekWiseSeatsTotal,
            isSeatsDataRequired,
          });
          makeTextBoldOfNRows({ worksheet, startingRow: row, numberOfRowsAdded: rowsAdded });
          row += rowsAdded;
          totalRowWeekWise = headerWeekNums.reduce((acc, x) => ({ ...acc, [x]: [] }), {});
          lastBookingWeek = booking.Week;
          totalCurrencyAndWeekWiseSeatsTotal = Object.values(VENUE_CURRENCY_SYMBOLS).reduce(
            (acc, symbol) => ({ ...acc, [symbol]: [] }),
            {},
          );
        }
      }

      // Get values from booking object for left portion of the sheet which is Week Day Date Town Venue columns
      const arr: any[] = getValuesFromObject(booking, LEFT_PORTION_KEYS);
      const isCancelled = booking.BookingStatusCode === BOOK_STATUS_CODES.X;
      const isSuspended = booking.BookingStatusCode === BOOK_STATUS_CODES.S;
      // values array to store sales data for the booking
      const values: any[] = [];
      // Loop through each week and get sales data for the booking
      for (let i = 0, col = 6; i < variableColsLength; i++, col++) {
        // Get sales data for the booking and week
        const val = bookingSalesByWeek?.[`${booking.BookingId} ${headerWeekDates[i]}`]?.[0];
        let totalObjToPush: Pick<TotalForSheet, 'Value' | 'ConversionRate' | 'VenueCurrencySymbol'> = {
          Value: 0,
          ConversionRate: 0,
          VenueCurrencySymbol: booking.VenueCurrencySymbol,
        };

        if (val) {
          // if sales data is available, add the value to the values array
          values.push(val.Value);
          if (!isSuspended && !isCancelled) {
            // if the booking is not cancelled or suspended, add the sales data to the total arrays which are used to calculate totals
            totalObjToPush = {
              Value: val.Value,
              ConversionRate: val.ConversionRate,
              VenueCurrencySymbol: val.VenueCurrencySymbol,
            };
          }
          if (isSeatsDataRequired) {
            // if seats data is required, calculate the seats data for the booking
            seatsData = {
              Seats: val.Seats,
              TotalCapacity: val.TotalCapacity,
              Percentage: val.Seats === 0 || val.TotalCapacity === 0 ? 0.0 : val.Seats / val.TotalCapacity,
            };
            if (!isCancelled && !isSuspended) {
              // if the booking is not cancelled or suspended, add the seats data to the total arrays
              totalCurrencyAndWeekWiseSeatsTotal[val.VenueCurrencySymbol].push({
                Seats: seatsData.Seats,
                TotalCapacity: seatsData.TotalCapacity,
                VenueCurrencySymbol: val.VenueCurrencySymbol,
              });
              // add the seats data to the currency wise total array
              totalCurrencyWiseSeatsTotal[val.VenueCurrencySymbol].push({
                Seats: seatsData.Seats,
                TotalCapacity: seatsData.TotalCapacity,
                VenueCurrencySymbol: val.VenueCurrencySymbol,
              });
            }
          }
        } else if (compareDatesWithoutTime(booking.Date.getTime(), headerWeekDates[i], '<')) {
          // if the booking date is before the week date, add final figures value to the values array and totalObject
          totalObjToPush = {
            Value: booking.FormattedFinalFiguresValue,
            ConversionRate: booking.ConversionRate,
            VenueCurrencySymbol: booking.VenueCurrencySymbol,
          };
          values.push(booking.FormattedFinalFiguresValue);
        } else {
          // if no sales data is available, add an empty value to the values array
          totalObjToPush = { Value: 0, ConversionRate: 0, VenueCurrencySymbol: booking.VenueCurrencySymbol };
          values.push('');
        }

        // Push the total object to the total arrays
        const finalValueToPushed: TotalForSheet = {
          ...totalObjToPush,
          ConvertedValue:
            !isNaN(totalObjToPush.ConversionRate) && !isNaN(totalObjToPush.Value)
              ? totalObjToPush.Value * totalObjToPush.ConversionRate
              : 0,
        };
        // push finalValue to total Weeks by week data array and rowwise total array
        totalForWeeks[headerWeekNums[i]].push(finalValueToPushed);
        totalRowWeekWise[headerWeekNums[i]].push(finalValueToPushed);
      }

      // Calculating Current Vs Prev Week Value
      const currVSPrevWeekValue: number = calculateCurrVSPrevWeekValue({ valuesArrayOnly: values });
      const { VenueCurrencySymbol } = booking;
      const rowData: string[] = [
        ...arr,
        ...values.map((num) => num),
        currVSPrevWeekValue,
        ...(seatsData?.Seats !== undefined ? [seatsData.Seats, seatsData.TotalCapacity, seatsData.Percentage] : []),
      ];
      worksheet.addRow(sanitizeRowData(rowData));
      // Apply currency formatting for sales data
      applyFormattingToRange({
        worksheet,
        startRow: row,
        startColumn: worksheet.getColumn(arr.length).letter,
        endRow: row,
        endColumn: worksheet.getColumn(arr.length + values.length + 1).letter,
        formatOptions: { numFmt: `${VenueCurrencySymbol || ''}#,##0.00` },
      });
      // apply number formatting for the seats data
      applyFormattingToRange({
        worksheet,
        startRow: row,
        startColumn: worksheet.getColumn(arr.length + values.length + 2).letter,
        endRow: row,
        endColumn: worksheet.getColumn(arr.length + values.length + 3).letter,
        formatOptions: { numFmt: '#,##0' },
      });
      // apply percentage formatting for change vs last week value columns
      applyFormattingToRange({
        worksheet,
        startRow: row,
        startColumn: worksheet.getColumn(arr.length + values.length + 4).letter,
        endRow: row,
        endColumn: worksheet.getColumn(arr.length + values.length + 4).letter,
        formatOptions: { numFmt: '0.00%' },
      });

      // For Color Coding
      for (let i = 0, col = 6; i < variableColsLength; i++, col++) {
        const val = bookingSalesByWeek?.[`${booking.BookingId} ${headerWeekDates[i]}`]?.[0];
        if (val?.Value) {
          // if sales data is available, apply background color based on flags like isCopy, isBrochureReleased, etc.
          assignBackgroundColor({
            worksheet,
            row,
            col,
            props: {
              SetIsCopy: val.SetIsCopy,
              SetBrochureReleased: val.SetBrochureReleased,
              BookingStatusCode: booking.BookingStatusCode,
              Date: val.Date,
              SetProductionWeekDate: headerWeekDates[i],
              NotOnSalesDate: val.NotOnSalesDate,
            },
            meta: { weekCols: variableColsLength + 1 },
          });
        } else {
          if (isCancelled || isSuspended) continue;
          // if no sales data is available, apply background color based on booking date and not on sale date
          if (compareDatesWithoutTime(booking.Date.getTime(), headerWeekDates[i], '<')) {
            // if the booking date is before the week date, apply background color blue
            colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.BLUE });
          }
          if (booking?.NotOnSaleDate && compareDatesWithoutTime(headerWeekDates[i], booking.NotOnSaleDate, '<=')) {
            // if the booking is not on sale for the week, apply background color red
            colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.RED });
          }
        }
      }

      if (isCancelled || isSuspended) {
        // if the booking is cancelled, color the row with black background
        // if the booking is suspended, color the row with purple background
        colorTextAndBGCell({
          worksheet,
          row,
          col: 5,
          textColor: COLOR_HEXCODE.WHITE,
          cellColor: isCancelled ? COLOR_HEXCODE.BLACK : COLOR_HEXCODE.PURPLE,
        });
      }
      row++;
    });

    // Filling Last Week wise totals
    if (isWeeklyReport) {
      // if weekly report is enabled, add a total row for the last week
      const rowsAdded: number = handleAddingWeeklyTotalRow({
        worksheet,
        headerWeekNums,
        totalRowWeekWise,
        lastBookingWeek,
        totalCurrencyAndWeekWiseSeatsTotal,
        isSeatsDataRequired,
      });
      // make the total row bold
      makeTextBoldOfNRows({ worksheet, startingRow: row, numberOfRowsAdded: rowsAdded });
      row += rowsAdded;
    }

    // add an empty row after the sales data
    worksheet.addRow([]);
    row++;

    // get seats data for Euro
    const seatsDataForEuro: number[] = isSeatsDataRequired
      ? getSeatsColumnForWeekTotal({
          currencySymbol: VENUE_CURRENCY_SYMBOLS.EURO,
          totalCurrencyWiseSeatsMapping: totalCurrencyWiseSeatsTotal,
        })
      : [];

    // Add Euro Total Row
    const weekWiseDataInEuro = headerWeekNums.map((weekNum) =>
      getCurrencyWiseTotal({
        totalForWeeks,
        setProductionWeekNum: weekNum,
        currencySymbol: VENUE_CURRENCY_SYMBOLS.EURO,
      }),
    );
    if (weekWiseDataInEuro.length) {
      worksheet.addRow(
        sanitizeRowData([
          '',
          '',
          '',
          '',
          'Total Sales €',
          ...weekWiseDataInEuro,
          getChangeVsLastWeekValue(weekWiseDataInEuro),
          ...seatsDataForEuro,
        ]),
      );

      // Apply currency formatting for Euro Total Row
      applyFormattingToRange({
        worksheet,
        startRow: row,
        startColumn: worksheet.getColumn(6).letter,
        endRow: row,
        endColumn: worksheet.getColumn(6 + weekWiseDataInEuro.length).letter,
        formatOptions: { numFmt: '€#,##0.00' },
      });
      row++;
    }
    // Add Pound Total Row
    const seatsDataForPound: number[] = isSeatsDataRequired
      ? getSeatsColumnForWeekTotal({
          currencySymbol: VENUE_CURRENCY_SYMBOLS.POUND,
          totalCurrencyWiseSeatsMapping: totalCurrencyWiseSeatsTotal,
        })
      : [];

    // get currency wise total for pound
    const weekWiseDataInPound = headerWeekNums.map((weekNum) =>
      getCurrencyWiseTotal({
        totalForWeeks,
        setProductionWeekNum: weekNum,
        currencySymbol: VENUE_CURRENCY_SYMBOLS.POUND,
      }),
    );

    // add total sales in pound and seats data for pound
    worksheet.addRow(
      sanitizeRowData([
        '',
        '',
        '',
        '',
        'Total Sales £',
        ...weekWiseDataInPound,
        getChangeVsLastWeekValue(weekWiseDataInPound),
        ...seatsDataForPound,
      ]),
    );
    applyFormattingToRange({
      worksheet,
      startRow: row,
      startColumn: worksheet.getColumn(6).letter,
      endRow: row,
      endColumn: worksheet.getColumn(6 + weekWiseDataInPound.length).letter,
      formatOptions: { numFmt: '£#,##0.00' },
    });
    row++;
    // Add empty row
    worksheet.addRow([]);
    row++;
    // Add Grand Total Row
    const seatsDataForTotal: number[] = isSeatsDataRequired
      ? getSeatsDataForTotal({ seatsDataForEuro, seatsDataForPound })
      : [];

    // get weekwise total in pound for grand total row
    const weekWiseGrandTotalInPound = headerWeekNums.map((weekNum) =>
      getWeekWiseGrandTotalInPound({ totalForWeeks, setProductionWeekNum: weekNum }),
    );
    worksheet.addRow(
      sanitizeRowData([
        '',
        '',
        '',
        '',
        'Grand Total £',
        ...weekWiseGrandTotalInPound,
        getChangeVsLastWeekValue(weekWiseGrandTotalInPound),
        ...seatsDataForTotal,
      ]),
    );
    // Apply currency formatting for Grand Total Row
    applyFormattingToRange({
      worksheet,
      startRow: row,
      startColumn: worksheet.getColumn(6).letter,
      endRow: row,
      endColumn: worksheet.getColumn(6 + weekWiseGrandTotalInPound.length).letter,
      formatOptions: { numFmt: '£#,##0.00' },
    });
    // apply number formatting for seats data in grand total row
    applyFormattingToRange({
      worksheet,
      startRow: row - 3,
      startColumn: worksheet.getColumn(weekWiseGrandTotalInPound.length + 7).letter,
      endRow: row,
      endColumn: worksheet.getColumn(weekWiseGrandTotalInPound.length + 8).letter,
      formatOptions: { numFmt: '#,##0' },
    });
    // apply percentage formatting for change % in grand total row
    applyFormattingToRange({
      worksheet,
      startRow: row - 3,
      startColumn: worksheet.getColumn(weekWiseGrandTotalInPound.length + 9).letter,
      endRow: row,
      endColumn: worksheet.getColumn(weekWiseGrandTotalInPound.length + 9).letter,
      formatOptions: { numFmt: '0.00%' },
    });

    // Color Coding for Grand Total
    for (let i = 0; i <= variableColsLength + (isSeatsDataRequired ? 3 : 0) + 1; i++) {
      colorCell({ worksheet, row, col: i + 5, argbColor: COLOR_HEXCODE.YELLOW });
      addCellBorder({ worksheet, row, col: i + 5, argbColor: COLOR_HEXCODE.YELLOW });
      makeCellTextBold({ worksheet, row, col: i + 5 });
    }
    row++;
    // Add empty row
    worksheet.addRow([]);
    row++;
    // Add Weekly Increase £ and Weekly Increase %
    const WeeklyIncrease = weekWiseGrandTotalInPound.map((value: number, i: number) =>
      i === 0 ? 0 : value - weekWiseGrandTotalInPound[i - 1],
    );
    // Add Weekly Increase £ and Weekly Increase % to the worksheet
    worksheet.addRow(sanitizeRowData(['', '', '', '', 'Weekly Increase £', ...WeeklyIncrease]));
    // Apply currency formatting for Weekly Grand total in pound
    applyFormattingToRange({
      worksheet,
      startRow: row,
      startColumn: worksheet.getColumn(6).letter,
      endRow: row,
      endColumn: worksheet.getColumn(6 + weekWiseGrandTotalInPound.length).letter,
      formatOptions: { numFmt: '£#,##0.00' },
    });
    row++;
    const WeeklyIncreasePercent = weekWiseGrandTotalInPound.map((_: number, i: number) =>
      i === 0 ? 0 : WeeklyIncrease[i] / weekWiseGrandTotalInPound[i],
    );
    // Add Weekly Increase % to the worksheet
    worksheet.addRow(sanitizeRowData(['', '', '', '', 'Weekly Increase %', ...WeeklyIncreasePercent]));
    // apply percentage formatting for Weekly Increase %
    applyFormattingToRange({
      worksheet,
      startRow: row,
      startColumn: worksheet.getColumn(6).letter,
      endRow: row,
      endColumn: worksheet.getColumn(6 + weekWiseGrandTotalInPound.length).letter,
      formatOptions: { numFmt: '0.00%' },
    });
    row++;

    makeColumnTextBold({ worksheet, colAsChar: 'A' });
    makeColumnTextBold({ worksheet, colAsChar: 'B' });
    makeColumnTextBold({ worksheet, colAsChar: 'C' });
    makeColumnTextBold({ worksheet, colAsChar: 'D' });
    makeColumnTextBold({ worksheet, colAsChar: 'E' });

    makeRowTextNormal({ worksheet, row: row - 4 });
    makeRowTextNormal({ worksheet, row: row - 3 });

    const numberOfColumns = worksheet.columnCount;
    const lastColumn = String.fromCharCode('A'.charCodeAt(0) + numberOfColumns);
    worksheet.mergeCells(`A1:${lastColumn}1`);
    worksheet.getColumn('A').width = 9;
    worksheet.getColumn('B').width = 5;
    worksheet.getColumn('C').width = 10;

    // Column Styling
    alignCellTextRight({ worksheet, colAsChar: 'C' });
    for (
      let char = 'F', i = 0;
      i <= variableColsLength + (isSeatsDataRequired ? 3 : 0);
      i++, char = String.fromCharCode(char.charCodeAt(0) + 1)
    ) {
      alignCellTextRight({ worksheet, colAsChar: char });
    }
    // Row Styling
    makeRowTextBold({ worksheet, row: 1 });
    makeRowTextBoldAndALignCenter({ worksheet, row: 3 });
    makeRowTextBoldAndALignCenter({ worksheet, row: 4 });
    // Styling for the header rows in green and align text to left
    styleHeader({ worksheet, row: 1, bgColor: COLOR_HEXCODE.DARK_GREEN, alignment: { horizontal: ALIGNMENT.LEFT } });
    styleHeader({ worksheet, row: 2, bgColor: COLOR_HEXCODE.DARK_GREEN, alignment: { horizontal: ALIGNMENT.LEFT } });
    styleHeader({ worksheet, row: 3, bgColor: COLOR_HEXCODE.DARK_GREEN });
    styleHeader({ worksheet, row: 4, bgColor: COLOR_HEXCODE.DARK_GREEN });
    styleHeader({ worksheet, row: 5, bgColor: COLOR_HEXCODE.DARK_GREEN });
    addWidthAsPerContent({
      worksheet,
      fromColNumber: 4,
      toColNumber: numberOfColumns,
      startingColAsCharWIthCapsOn: 'D',
      minColWidth: 8,
      bufferWidth: 2,
      rowsToIgnore: 2,
      maxColWidth: Infinity,
    });
    // add border to all cells to avoid loss of border for cells with border colors
    addBorderToAllCells({ worksheet });
    worksheet.getCell(1, 1).font = { size: 16, color: { argb: COLOR_HEXCODE.WHITE }, bold: true };
    if (format === 'pdf') {
      worksheet.pageSetup.printArea = `A1:${worksheet.getColumn(columns.length).letter}${row}`;
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
      return;
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${title}.xlsx"`);

    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (e) {
    console.error('Error Generating Sales Summary Report', e);
    res.status(500).send('Internal server error');
  }
}
