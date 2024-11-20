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
  TRequiredFields,
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
import { calculateWeekNumber, compareDatesWithoutTime, formatDate } from 'services/dateService';
import { group, unique } from 'radash';
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
  Day: EntryDate ? formatDate(new Date(EntryDate), 'eeee') : '',
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
    const key = getScheduleKey({
      FullProductionCode: salesSet.FullProductionCode,
      BookingFirstDate: formatDate(salesSet.EntryDate, 'yyyy-MM-dd'),
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

const fetchProductionBookings = async (productionId: number): Promise<ProductionSummary[]> => {
  const [salesData, schedule] = await all([getGeneralSalesSummary(productionId), getSchedule(productionId)]);
  const rows = unique(schedule as ScheduleView[], (entry: ScheduleView) => entry.EntryId)
    .map((entry) => {
      const key = getScheduleKey({
        FullProductionCode: entry.FullProductionCode,
        BookingFirstDate: formatDate(entry.EntryDate, 'yyyy-MM-dd'),
      });
      const sales = salesData[key] || {};
      return {
        ...entry,
        ...transformSummaryRow(entry),
        ...sales,
      };
    })
    .sort((a, b) => new Date(a.EntryDate).getTime() - new Date(b.EntryDate).getTime());
  return rows;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { productionId, fromWeek, toWeek, isWeeklyReport, isSeatsDataRequired, format, exportedAt } = req.body || {};
  try {
    prisma = await getPrismaClient(req);
    const bookings = await fetchProductionBookings(+productionId);
    const { StartDate, EndDate } = bookings?.[0] || {};
    const weeks: ProductionWeek[] = getWeeksBetweenDates(fromWeek, toWeek || EndDate).map((week) => {
      const weekNum = calculateWeekNumber(new Date(StartDate), new Date(week.mondayDate));
      return {
        weekNum,
        productionWeekNum: formatWeek(weekNum),
        ...week,
      };
    });
    const workbook = new ExcelJS.Workbook();
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
    const jsonArray: TRequiredFields[] = data
      .filter((x) => x.SaleTypeName === SALES_TYPE_NAME.GENERAL_SALES)
      .map(
        ({
          BookingProductionWeekNum,
          BookingFirstDate,
          VenueTown,
          VenueName,
          Value,
          VenueCurrencyCode,
          SetBookingWeekNum,
          SetProductionWeekDate,
          ConversionRate,
          SetIsCopy,
          SetBrochureReleased,
          BookingStatusCode,
          FinalFiguresValue,
          TotalCapacity,
          Seats,
          NotOnSalesDate,
          SetProductionWeekNum,
          BookingId,
        }) => ({
          BookingId,
          BookingProductionWeekNum,
          BookingFirstDate,
          VenueTown,
          VenueName,
          Value: Value?.toNumber?.(),
          VenueCurrencySymbol: currencyCodeToSymbolMap[VenueCurrencyCode],
          SetBookingWeekNum,
          SetProductionWeekDate,
          ConversionRate,
          SetIsCopy,
          SetBrochureReleased,
          BookingStatusCode,
          FinalFiguresValue: FinalFiguresValue?.toNumber?.(),
          TotalCapacity,
          Seats: Seats?.toNumber?.(),
          NotOnSalesDate,
          SetProductionWeekNum,
        }),
      );
    const finalFormattedValues: TRequiredFieldsFinalFormat[] = jsonArray.map((x: TRequiredFields) => ({
      ...x,
      Week: formatWeek(x.BookingProductionWeekNum),
      FormattedValue: x.Value ? `${x.VenueCurrencySymbol}${x.Value}` : '',
      Value: x.Value || 0,
      FormattedSetProductionWeekNum: formatWeek(x.SetProductionWeekNum),
      FormattedFinalFiguresValue: x.FinalFiguresValue || 0,
      Day: x.BookingFirstDate ? formatDate(x.BookingFirstDate, 'eeee') : '',
      Date: x.BookingFirstDate,
      Town: x.VenueTown,
      Venue: x.VenueName,
      SetProductionWeekDate: x.SetProductionWeekDate
        ? new Date(x.SetProductionWeekDate)?.toISOString()?.split('T')?.[0]
        : '',
    }));
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

    // Adding Heading
    const reportName = salesReportName({ isWeeklyReport, isSeatsDataRequired, data: bookings });
    const title = `${reportName} - ${formatDate(exportedAt, 'dd.MM.yy')}`;
    worksheet.addRow([title]);
    const exportedAtTitle = getExportedAtTitle(exportedAt);
    worksheet.addRow([exportedAtTitle]);
    worksheet.mergeCells('A2:D2');
    worksheet.addRow([]);

    // Adding Table Columns
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

    const totalForWeeks: WeekAggregates = headerWeekNums.reduce((acc, x) => ({ ...acc, [x]: [] }), {});
    let totalRowWeekWise: WeekAggregates = headerWeekNums.reduce((acc, x) => ({ ...acc, [x]: [] }), {});
    let totalCurrencyAndWeekWiseSeatsTotal: WeekAggregateSeatsDetail = Object.values(VENUE_CURRENCY_SYMBOLS).reduce(
      (acc, symbol) => ({ ...acc, [symbol]: [] }),
      {},
    );
    const totalCurrencyWiseSeatsTotal: WeekAggregateSeatsDetail = Object.values(VENUE_CURRENCY_SYMBOLS).reduce(
      (acc, symbol) => ({ ...acc, [symbol]: [] }),
      {},
    );

    const variableColsLength: number = headerWeekNums.length;
    let row = 7;

    let lastBookingWeek: string = finalFormattedValues?.[0]?.Week;
    let seatsData: {
      Seats?: number;
      TotalCapacity?: number;
      Percentage?: number;
      Currency?: TRequiredFieldsFinalFormat['VenueCurrencySymbol'];
    } = {};
    bookings.forEach((booking) => {
      // Adding Weekly Totals
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

      // Calculating Values
      const arr: any[] = getValuesFromObject(booking, LEFT_PORTION_KEYS);
      const isCancelled = booking.BookingStatusCode === BOOK_STATUS_CODES.X;
      const isSuspended = booking.BookingStatusCode === BOOK_STATUS_CODES.S;
      const values: any[] = [];
      for (let i = 0, col = 6; i < variableColsLength; i++, col++) {
        const val = bookingSalesByWeek?.[`${booking.BookingId} ${headerWeekDates[i]}`]?.[0];
        let totalObjToPush: Pick<TotalForSheet, 'Value' | 'ConversionRate' | 'VenueCurrencySymbol'> = {
          Value: 0,
          ConversionRate: 0,
          VenueCurrencySymbol: booking.VenueCurrencySymbol,
        };
        if (val) {
          values.push(val.Value);
          if (!isSuspended && !isCancelled) {
            totalObjToPush = {
              Value: val.Value,
              ConversionRate: val.ConversionRate,
              VenueCurrencySymbol: val.VenueCurrencySymbol,
            };
          }
          if (isSeatsDataRequired) {
            seatsData = {
              Seats: val.Seats,
              TotalCapacity: val.TotalCapacity,
              Percentage: val.Seats === 0 || val.TotalCapacity === 0 ? 0.0 : val.Seats / val.TotalCapacity,
            };
            if (!isCancelled && !isSuspended) {
              totalCurrencyAndWeekWiseSeatsTotal[val.VenueCurrencySymbol].push({
                Seats: seatsData.Seats,
                TotalCapacity: seatsData.TotalCapacity,
                VenueCurrencySymbol: val.VenueCurrencySymbol,
              });
              totalCurrencyWiseSeatsTotal[val.VenueCurrencySymbol].push({
                Seats: seatsData.Seats,
                TotalCapacity: seatsData.TotalCapacity,
                VenueCurrencySymbol: val.VenueCurrencySymbol,
              });
            }
          }
        } else if (compareDatesWithoutTime(booking.Date, headerWeekDates[i], '<')) {
          totalObjToPush = {
            Value: booking.FormattedFinalFiguresValue,
            ConversionRate: booking.ConversionRate,
            VenueCurrencySymbol: booking.VenueCurrencySymbol,
          };
          values.push(booking.FormattedFinalFiguresValue);
        } else {
          totalObjToPush = { Value: 0, ConversionRate: 0, VenueCurrencySymbol: booking.VenueCurrencySymbol };
          values.push('');
        }

        const finalValueToPushed: TotalForSheet = {
          ...totalObjToPush,
          ConvertedValue:
            !isNaN(totalObjToPush.ConversionRate) && !isNaN(totalObjToPush.Value)
              ? totalObjToPush.Value * totalObjToPush.ConversionRate
              : 0,
        };
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
      applyFormattingToRange({
        worksheet,
        startRow: row,
        startColumn: worksheet.getColumn(arr.length).letter,
        endRow: row,
        endColumn: worksheet.getColumn(arr.length + values.length + 1).letter,
        formatOptions: { numFmt: VenueCurrencySymbol + '#,##0.00' },
      });
      applyFormattingToRange({
        worksheet,
        startRow: row,
        startColumn: worksheet.getColumn(arr.length + values.length + 2).letter,
        endRow: row,
        endColumn: worksheet.getColumn(arr.length + values.length + 3).letter,
        formatOptions: { numFmt: '#,##0' },
      });
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
          if (compareDatesWithoutTime(booking.Date, headerWeekDates[i], '<')) {
            colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.BLUE });
          }
          if (booking?.NotOnSaleDate && compareDatesWithoutTime(headerWeekDates[i], booking.NotOnSaleDate, '<=')) {
            colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.RED });
          }
        }
      }

      if (isCancelled || isSuspended) {
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
    }

    // STYLINGS
    worksheet.addRow([]);
    row++;

    // Add Euro Total Row
    const seatsDataForEuro: number[] = isSeatsDataRequired
      ? getSeatsColumnForWeekTotal({
          currencySymbol: VENUE_CURRENCY_SYMBOLS.EURO,
          totalCurrencyWiseSeatsMapping: totalCurrencyWiseSeatsTotal,
        })
      : [];
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
    const weekWiseDataInPound = headerWeekNums.map((weekNum) =>
      getCurrencyWiseTotal({
        totalForWeeks,
        setProductionWeekNum: weekNum,
        currencySymbol: VENUE_CURRENCY_SYMBOLS.POUND,
      }),
    );
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
    applyFormattingToRange({
      worksheet,
      startRow: row,
      startColumn: worksheet.getColumn(6).letter,
      endRow: row,
      endColumn: worksheet.getColumn(6 + weekWiseGrandTotalInPound.length).letter,
      formatOptions: { numFmt: '£#,##0.00' },
    });
    applyFormattingToRange({
      worksheet,
      startRow: row - 3,
      startColumn: worksheet.getColumn(weekWiseGrandTotalInPound.length + 7).letter,
      endRow: row,
      endColumn: worksheet.getColumn(weekWiseGrandTotalInPound.length + 8).letter,
      formatOptions: { numFmt: '#,##0' },
    });
    applyFormattingToRange({
      worksheet,
      startRow: row - 3,
      startColumn: worksheet.getColumn(weekWiseGrandTotalInPound.length + 9).letter,
      endRow: row,
      endColumn: worksheet.getColumn(weekWiseGrandTotalInPound.length + 9).letter,
      formatOptions: { numFmt: '0.00%' },
    });
    // Coloring this row
    for (let i = 0; i <= variableColsLength + (isSeatsDataRequired ? 3 : 0) + 1; i++) {
      colorCell({ worksheet, row, col: i + 5, argbColor: COLOR_HEXCODE.YELLOW });
      addCellBorder({ worksheet, row, col: i + 5, argbColor: COLOR_HEXCODE.YELLOW });
      makeCellTextBold({ worksheet, row, col: i + 5 });
    }
    row++;
    // Add empty row
    worksheet.addRow([]);
    row++;
    const WeeklyIncrease = weekWiseGrandTotalInPound.map((value: number, i: number) =>
      i === 0 ? 0 : value - weekWiseGrandTotalInPound[i - 1],
    );
    worksheet.addRow(sanitizeRowData(['', '', '', '', 'Weekly Increase £', ...WeeklyIncrease]));
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
    worksheet.addRow(sanitizeRowData(['', '', '', '', 'Weekly Increase %', ...WeeklyIncreasePercent]));
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
