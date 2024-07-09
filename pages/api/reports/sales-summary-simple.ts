import { Prisma } from '@prisma/client';
import ExcelJS from 'exceljs';
import prisma from 'lib/prisma';
import moment from 'moment';
import {
  COLOR_HEXCODE,
  alignCellTextRight,
  assignBackgroundColor,
  calculateCurrVSPrevWeekValue,
  colorCell,
  getChangeVsLastWeekValue,
  getCurrencyWiseTotal,
  getMapKeyForValue,
  getValuesFromObject,
  getWeekWiseGrandTotalInPound,
  handleAddingWeeklyTotalRow,
  makeRowTextBold,
  makeRowTextBoldAndALignCenter,
  makeTextBoldOfNRows,
  groupBasedOnVenueWeeksKeepingVenueCommon,
  CONSTANTS,
  getUniqueAndSortedHeaderProductionColumns,
  getMapKey,
  formatWeek,
  LEFT_PORTION_KEYS,
  getSeatsColumnForWeekTotal,
  getSeatsDataForTotal,
  makeColumnTextBold,
  makeCellTextBold,
  salesReportName,
  addCellBorder,
  convertDateFormat,
  makeRowTextNormal,
  applyFormattingToRange,
  colorTextAndBGCell,
} from 'services/salesSummaryService';
import {
  SALES_TYPE_NAME,
  TGroupBasedOnWeeksKeepingVenueCommon,
  TKeyAndGroupBasedOnWeeksKeepingVenueCommonMapping,
  TRequiredFields,
  TRequiredFieldsFinalFormat,
  TSalesView,
  TotalForSheet,
  UniqueHeadersObject,
  VENUE_CURRENCY_SYMBOLS,
  WeekAggregateSeatsDetail,
  WeekAggregates,
} from 'types/SalesSummaryTypes';
import { addWidthAsPerContent } from 'services/reportsService';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { styleHeader } from './masterplan';

// TODO
// Decimal upto 2 places fix
// Production row height fix

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { productionId, fromWeek, toWeek, isWeeklyReport, isSeatsDataRequired } = req.body || {};

  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, { ProductionId: productionId });
  if (!access) return res.status(401).end();

  const workbook = new ExcelJS.Workbook();
  const conditions: Prisma.Sql[] = [];
  if (productionId) {
    conditions.push(Prisma.sql`ProductionId = ${parseInt(productionId)}`);
  }
  if (fromWeek && toWeek) {
    conditions.push(Prisma.sql`setProductionWeekDate BETWEEN ${fromWeek} AND ${toWeek}`);
  }
  const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty;
  const data: TSalesView[] =
    await prisma.$queryRaw`select * FROM SalesView ${where} order by BookingFirstDate, SetSalesFiguresDate;`;

  const jsonArray: TRequiredFields[] = data
    .filter((x) => x.SaleTypeName === SALES_TYPE_NAME.GENERAL_SALES)
    .map(
      ({
        BookingProductionWeekNum,
        BookingFirstDate,
        VenueTown,
        VenueName,
        Value,
        VenueCurrencySymbol,
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
      }) => ({
        BookingProductionWeekNum,
        BookingFirstDate,
        VenueTown,
        VenueName,
        Value: Value?.toNumber?.(),
        VenueCurrencySymbol,
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
    Day: moment(x.BookingFirstDate).format('dddd'),
    Date: x.BookingFirstDate,
    Town: x.VenueTown,
    Venue: x.VenueName,
  }));

  // Write data to the worksheet
  const worksheet = workbook.addWorksheet('My Sales', {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    views: [{ state: 'frozen', xSplit: 5, ySplit: 5 }],
  });

  const mapOfCreatedKeyAndModifiedFetchedValue: { [key: string]: TRequiredFieldsFinalFormat } =
    finalFormattedValues.reduce(
      (acc, x) => ({
        ...acc,
        [getMapKey(x)]: x,
      }),
      {},
    );

  // Logic for headers
  const uniqueProductionColumns: UniqueHeadersObject[] =
    getUniqueAndSortedHeaderProductionColumns(finalFormattedValues);
  const headerWeekNums: string[] = uniqueProductionColumns.map((x) => x.FormattedSetProductionWeekNum);
  const headerWeekDates: string[] = uniqueProductionColumns.map((x) => x.SetProductionWeekDate);

  // Adding Heading
  const title = salesReportName({ isWeeklyReport, isSeatsDataRequired, data });
  worksheet.addRow([title]);
  // worksheet.getCell(1, 1).value = data?.length ? data[0].ShowName + ' (' + data[0].FullProductionCode + ')' : 'Dummy Report'
  worksheet.addRow([]);

  // Adding Table Columns
  const columns: string[] = [
    'Production',
    '',
    '',
    '',
    '',
    ...uniqueProductionColumns.map((x) => x.FormattedSetProductionWeekNum),
    CONSTANTS.CHANGE_VS,
    ...(isSeatsDataRequired ? [CONSTANTS.RUN_SEATS, CONSTANTS.RUN_SEATS, CONSTANTS.RUN_SALES] : []),
  ];
  worksheet.addRow(columns);
  worksheet.addRow([
    'Week',
    'Day',
    'Date',
    'Town',
    'Venue',
    ...uniqueProductionColumns.map((x) => convertDateFormat(x.SetProductionWeekDate)),
    'Last Week',
    ...(isSeatsDataRequired ? ['Sold', 'Capacity', 'vs Capacity'] : []),
  ]);
  worksheet.addRow([]);

  // for (let char = 'A', i = 0; i < columns.length; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
  //   worksheet.getColumn(char).width = 17
  // }

  const groupBasedOnVenue: TKeyAndGroupBasedOnWeeksKeepingVenueCommonMapping = groupBasedOnVenueWeeksKeepingVenueCommon(
    { modifiedFetchedValues: finalFormattedValues },
  );

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
  let row = 6;

  let lastBookingWeek: string = finalFormattedValues?.[0]?.Week;
  let seatsData: {
    Seats?: number;
    TotalCapacity?: number;
    Percentage?: number;
    Currency?: TRequiredFieldsFinalFormat['VenueCurrencySymbol'];
  } = {};
  Object.values(groupBasedOnVenue).forEach((rowAsJSON: TGroupBasedOnWeeksKeepingVenueCommon) => {
    // Adding Weekly Totals
    if (isWeeklyReport) {
      if (lastBookingWeek !== rowAsJSON.Week) {
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
        lastBookingWeek = rowAsJSON.Week;
        totalCurrencyAndWeekWiseSeatsTotal = Object.values(VENUE_CURRENCY_SYMBOLS).reduce(
          (acc, symbol) => ({ ...acc, [symbol]: [] }),
          {},
        );
      }
    }

    // Calculating Values
    const arr: any[] = getValuesFromObject(rowAsJSON, LEFT_PORTION_KEYS);
    const values: number[] = [];
    for (let i = 0, col = 6; i < variableColsLength; i++, col++) {
      const key: string = getMapKeyForValue(rowAsJSON, {
        FormattedSetProductionWeekNum: headerWeekNums[i],
        SetProductionWeekDate: headerWeekDates[i],
      });
      const val: TRequiredFieldsFinalFormat = mapOfCreatedKeyAndModifiedFetchedValue[key];
      let totalObjToPush: Pick<TotalForSheet, 'Value' | 'ConversionRate' | 'VenueCurrencySymbol'> = {
        Value: 0,
        ConversionRate: 0,
        VenueCurrencySymbol: rowAsJSON.VenueCurrencySymbol,
      };
      if (val) {
        values.push(val.Value);
        totalObjToPush = {
          Value: val.Value,
          ConversionRate: val.ConversionRate,
          VenueCurrencySymbol: val.VenueCurrencySymbol,
        };
        if (isSeatsDataRequired) {
          seatsData = {
            Seats: val.Seats,
            TotalCapacity: val.TotalCapacity,
            Percentage: val.Seats === 0 || val.TotalCapacity === 0 ? 0.0 : val.Seats / val.TotalCapacity,
          };
          totalCurrencyAndWeekWiseSeatsTotal[val.VenueCurrencySymbol].push({
            Seats: seatsData.Seats as number,
            TotalCapacity: seatsData.TotalCapacity as number,
            VenueCurrencySymbol: val.VenueCurrencySymbol,
          });
          totalCurrencyWiseSeatsTotal[val.VenueCurrencySymbol].push({
            Seats: seatsData.Seats as number,
            TotalCapacity: seatsData.TotalCapacity as number,
            VenueCurrencySymbol: val.VenueCurrencySymbol,
          });
        }
      } else {
        if (moment(rowAsJSON.Date).valueOf() < moment(headerWeekDates[i]).valueOf()) {
          totalObjToPush = {
            Value: rowAsJSON.FormattedFinalFiguresValue,
            ConversionRate: rowAsJSON.ConversionRate,
            VenueCurrencySymbol: rowAsJSON.VenueCurrencySymbol,
          };
          values.push(rowAsJSON.FormattedFinalFiguresValue);
        } else {
          totalObjToPush = { Value: 0, ConversionRate: 0, VenueCurrencySymbol: rowAsJSON.VenueCurrencySymbol };
          values.push(0);
        }
      }

      const finalValueToPushed: TotalForSheet = {
        ...totalObjToPush,
        ConvertedValue: totalObjToPush.Value * totalObjToPush.ConversionRate,
      };
      totalForWeeks[headerWeekNums[i]].push(finalValueToPushed);
      totalRowWeekWise[headerWeekNums[i]].push(finalValueToPushed);
    }

    // Calculating Current Vs Prev Week Value
    const currVSPrevWeekValue: number = calculateCurrVSPrevWeekValue({ valuesArrayOnly: values });
    const { VenueCurrencySymbol } = rowAsJSON;
    const rowData: string[] = [
      ...arr,
      ...values.map((num) => num),
      currVSPrevWeekValue,
      ...(seatsData?.Seats !== undefined ? [seatsData.Seats, seatsData.TotalCapacity, seatsData.Percentage] : []),
    ];
    worksheet.addRow(rowData);
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
      const key: string = getMapKeyForValue(rowAsJSON, {
        FormattedSetProductionWeekNum: headerWeekNums[i],
        SetProductionWeekDate: headerWeekDates[i],
      });
      const val: TRequiredFieldsFinalFormat = mapOfCreatedKeyAndModifiedFetchedValue[key];
      if (val) {
        assignBackgroundColor({
          worksheet,
          row,
          col,
          props: {
            SetIsCopy: val.SetIsCopy,
            SetBrochureReleased: val.SetBrochureReleased,
            BookingStatusCode: val.BookingStatusCode,
            Date: val.Date,
            SetProductionWeekDate: headerWeekDates[i],
            NotOnSalesDate: rowAsJSON.NotOnSalesDate,
          },
          meta: { weekCols: variableColsLength + 1 },
        });
        if (val.BookingStatusCode === 'X') {
          colorTextAndBGCell({
            worksheet,
            row,
            col: 5,
            textColor: COLOR_HEXCODE.WHITE,
            cellColor: COLOR_HEXCODE.BLACK,
          });
        }
      } else {
        if (rowAsJSON?.BookingStatusCode === 'X') continue;
        if (moment(rowAsJSON.Date).valueOf() < moment(headerWeekDates[i]).valueOf()) {
          colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.BLUE });
        }
        if (
          rowAsJSON.NotOnSalesDate &&
          moment(headerWeekDates[i]).valueOf() < moment(rowAsJSON.NotOnSalesDate).valueOf()
        ) {
          colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.RED });
        }
      }
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
    getCurrencyWiseTotal({ totalForWeeks, setProductionWeekNum: weekNum, currencySymbol: VENUE_CURRENCY_SYMBOLS.EURO }),
  );
  if (weekWiseDataInEuro.length) {
    worksheet.addRow([
      '',
      '',
      '',
      '',
      'Total Sales €',
      ...weekWiseDataInEuro,
      getChangeVsLastWeekValue(weekWiseDataInEuro),
      ...seatsDataForEuro,
    ]);
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
  worksheet.addRow([
    '',
    '',
    '',
    '',
    'Total Sales £',
    ...weekWiseDataInPound,
    getChangeVsLastWeekValue(weekWiseDataInPound),
    ...seatsDataForPound,
  ]);

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
  worksheet.addRow([
    '',
    '',
    '',
    '',
    'Grand Total £',
    ...weekWiseGrandTotalInPound,
    getChangeVsLastWeekValue(weekWiseGrandTotalInPound),
    ...seatsDataForTotal,
  ]);
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

  makeColumnTextBold({ worksheet, colAsChar: 'A' });
  makeColumnTextBold({ worksheet, colAsChar: 'B' });
  makeColumnTextBold({ worksheet, colAsChar: 'C' });
  makeColumnTextBold({ worksheet, colAsChar: 'D' });
  makeColumnTextBold({ worksheet, colAsChar: 'E' });

  makeRowTextNormal({ worksheet, row: row - 4 });
  makeRowTextNormal({ worksheet, row: row - 3 });

  const totalColumns: number = worksheet.columnCount;
  const lastColumn: number = 'A'.charCodeAt(totalColumns);
  worksheet.mergeCells(`A1:${String.fromCharCode(lastColumn)}1`);
  worksheet.getCell(1, 1).font = { size: 16, bold: true };
  const numberOfColumns = worksheet.columnCount;
  worksheet.getColumn('A').width = 9;
  worksheet.getColumn('B').width = 5;
  worksheet.getColumn('C').width = 10;
  addWidthAsPerContent({
    worksheet,
    fromColNumber: 4,
    toColNumber: numberOfColumns,
    startingColAsCharWIthCapsOn: 'D',
    minColWidth: 10,
    bufferWidth: 2,
    rowsToIgnore: 4,
    maxColWidth: Infinity,
  });

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
  styleHeader({ worksheet, row: 1, bgColor: COLOR_HEXCODE.DARK_GREEN });
  styleHeader({ worksheet, row: 2, bgColor: COLOR_HEXCODE.DARK_GREEN });
  styleHeader({ worksheet, row: 3, bgColor: COLOR_HEXCODE.DARK_GREEN });
  styleHeader({ worksheet, row: 4, bgColor: COLOR_HEXCODE.DARK_GREEN });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${title}.xlsx"`);

  workbook.xlsx.write(res).then(() => {
    res.end();
  });
}
