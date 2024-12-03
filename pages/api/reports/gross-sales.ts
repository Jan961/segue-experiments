import ExcelJS from 'exceljs';
import getPrismaClient from 'lib/prisma';
import Decimal from 'decimal.js';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { ALIGNMENT, alignCellText, styleHeader } from './masterplan';
import { getExportedAtTitle } from 'utils/export';
import { currencyCodeToSymbolMap } from 'config/Reports';
import { calculateRemainingDaysInWeek, convertToPDF } from 'utils/report';
import { BOOK_STATUS_CODES, SALES_TYPE_NAME } from 'types/MarketingTypes';
import { calculateWeekNumber, formatDate, getDateDaysAway, getDifferenceInDays, newDate } from 'services/dateService';
import { SCHEDULE_VIEW } from 'services/reports/schedule-report';
import { UTCDate } from '@date-fns/utc';

type SALES_SUMMARY = {
  ProductionId: number;
  FullProductionCode: string;
  ShowName: string;
  ProductionStartDate: string;
  ProductionEndDate: string;
  ProductionWeekNum: number;
  EntryDate: string;
  Location: string | null;
  EntryId: number;
  EntryName: string;
  EntryType: string;
  EntryStatusCode: BOOK_STATUS_CODES;
  Value: any | null;
  VenueCurrencyCode: string | null;
  VenueCurrencySymbol: string | null;
  ConversionRate: number | null;
  ConversionToCurrencyCode: string | null;
  SetSalesFiguresDate: string | null;
  FinalSetSalesFiguresDate: string | null;
};

export const colorCell = ({
  worksheet,
  row,
  col,
  argbColor,
}: {
  worksheet: any;
  row: number;
  col: number;
  argbColor: COLOR_HEXCODE;
}) => {
  worksheet.getCell(row, col).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: argbColor },
  };
};

const colorTextAndBGCell = ({
  worksheet,
  row,
  col,
  textColor,
  cellColor,
  numFmt,
}: {
  worksheet: any;
  row: number;
  col: number;
  textColor?: COLOR_HEXCODE;
  cellColor?: COLOR_HEXCODE;
  numFmt?: string;
}) => {
  if (!textColor && !cellColor && !numFmt) {
    return;
  }
  const cell = worksheet.getCell(row, col);
  if (textColor) {
    cell.font = { color: { argb: textColor }, bold: true };
  }
  if (numFmt) {
    cell.numFmt = numFmt;
  }
  if (cellColor) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: cellColor },
    };
  }
};

const makeRowBold = ({ worksheet, row }: { worksheet: any; row: number }) => {
  worksheet.getRow(row).font = { bold: true };
};

const firstRowFormatting = ({ worksheet }: { worksheet: any }) => {
  worksheet.getRow(1).font = { bold: true, size: 16 };
  worksheet.getRow(1).alignment = { horizontal: 'left' };
};

const getKey = ({ FullProductionCode, ShowName, EntryDate }) => `${FullProductionCode} - ${ShowName} - ${EntryDate}`;

const getTotalInPound = ({ totalOfCurrency, conversionRate }) => {
  const euroVal = totalOfCurrency['€'];
  const finalValOfEuro = euroVal ? new Decimal(euroVal).mul(conversionRate).toNumber() : 0;
  return totalOfCurrency['£'] ? new Decimal(totalOfCurrency['£']).plus(finalValOfEuro).toNumber() : finalValOfEuro;
};

const findNextBookingDate = (
  currentDate: string,
  map: Record<string, SALES_SUMMARY>,
  FullProductionCode: string,
  ShowName: string,
  maxDays = 30, // Safety limit to prevent infinite loop
): string | null => {
  let checkDate = currentDate;
  let daysChecked = 0;

  while (daysChecked < maxDays) {
    // Move to next date
    checkDate = formatDate(getDateDaysAway(newDate(checkDate), 1), 'yyyy-MM-dd');
    daysChecked++;

    // Check if this date has a booking entry
    const key = getKey({ FullProductionCode, ShowName, EntryDate: checkDate });
    const entry = map[key];

    if (entry?.EntryType === 'Booking') {
      return checkDate;
    }
  }

  return null; // No booking found in next 30 days
};

const handler = async (req, res) => {
  try {
    const prisma = await getPrismaClient(req);
    const { productionId, format, exportedAt } = req.body || {};
    if (!productionId) {
      throw new Error('Params are missing');
    }
    const data = await prisma.salesSummaryView
      .findMany({
        where: {
          ProductionId: productionId,
          SaleTypeName: {
            in: [SALES_TYPE_NAME.GENERAL_SALES, SALES_TYPE_NAME.SCHOOL_SALES],
          },
        },
      })
      .then((res) =>
        res.map((x) => ({
          ...x,
          EntryDate: new UTCDate(x.EntryDate),
          ProductionStartDate: new UTCDate(x.ProductionStartDate),
          ProductionEndDate: new UTCDate(x.ProductionEndDate),
        })),
      );
    const schedule = await prisma.scheduleView
      .findMany({
        where: {
          ProductionId: productionId,
        },
        orderBy: {
          EntryDate: 'asc',
        },
      })
      .then((res) =>
        res.map((x) => ({
          ...x,
          EntryDate: new UTCDate(x.EntryDate),
          ProductionStartDate: new UTCDate(x.ProductionStartDate),
          ProductionEndDate: new UTCDate(x.ProductionEndDate),
        })),
      );
    let filename = 'Gross Sales';
    const workbook = new ExcelJS.Workbook();
    const formattedData = data.map((x) => ({
      ...x,
      Value: x.Value?.toNumber?.() || 0,
      EntryDate: formatDate(x.EntryDate, 'yyyy-MM-dd'),
      ProductionStartDate: formatDate(x.ProductionStartDate, 'yyyy-MM-dd'),
      ProductionEndDate: formatDate(x.ProductionEndDate, 'yyyy-MM-dd'),
    }));

    const formattedScheduleData = schedule.map((x) => ({
      ...x,
      EntryDate: formatDate(x.EntryDate, 'yyyy-MM-dd'),
      ProductionStartDate: formatDate(x.ProductionStartDate, 'yyyy-MM-dd'),
      ProductionEndDate: formatDate(x.ProductionEndDate, 'yyyy-MM-dd'),
    }));

    const worksheet = workbook.addWorksheet('Gross Sales', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    });

    if (!schedule?.length) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);

      await workbook.xlsx.write(res).then(() => {
        res.end();
      });
      return;
    }

    const { FullProductionCode = '', ShowName = '' } = schedule?.[0] || {};
    filename = `${FullProductionCode} ${ShowName} Gross Sales`;
    worksheet.addRow([`${filename}`]);
    const exportedAtTitle = getExportedAtTitle(exportedAt);
    worksheet.addRow([exportedAtTitle]);

    worksheet.addRow([]);

    const map: { [key: string]: SALES_SUMMARY } = formattedData.reduce((acc, x) => {
      const key = getKey(x);
      const previousValue = acc[key];
      return {
        ...acc,
        [key]: {
          ...x,
          Value: previousValue?.Value ? new Decimal(previousValue.Value).plus(x.Value).toNumber() : x.Value,
        },
      };
    }, {});
    const scheduleMap: { [key: string]: SCHEDULE_VIEW } = formattedScheduleData.reduce(
      (acc, x) => ({ ...acc, [getKey(x)]: x }),
      {},
    );
    const { ProductionStartDate: fromDate, ProductionEndDate: toDate } = schedule?.[0] || {};

    // +1 is for including the endDate
    const daysDiff = getDifferenceInDays(fromDate, toDate) + 1;

    let colNo = 1;
    let conversionRate = 0;

    const r4: string[] = [];
    const r5: string[] = [];
    const r6: string[] = [];
    const r7: string[] = [];
    const r8: string[] = [];
    const r9: any[] = [];

    const mergeRowCol: { row: number[]; col: number[] }[] = [];
    const cellColor: {
      cell: { rowNo: number; colNo: number };
      cellColor?: COLOR_HEXCODE;
      textColor?: COLOR_HEXCODE;
      numFmt?: string;
    }[] = [];
    const totalOfCurrency: { [key: string]: number } = { '£': 0, '€': 0 };
    const weekStartList = [];
    const addWeekDetails = (weekNumber: number, colNo: number, padding = 7) => {
      r4.push(`Week ${weekNumber}`);
      r5.push('');
      r6.push('');
      r8.push('');
      r9.push('');

      weekStartList.push(colNo);

      mergeRowCol.push({ row: [7, 8], col: [colNo, colNo] });
      mergeRowCol.push({
        row: [4, 4],
        col: [colNo, colNo + padding],
      });

      r7.push('Weekly Costs');
    };
    for (let i = 1; i <= daysDiff; i++) {
      const weekDay = formatDate(getDateDaysAway(fromDate, i - 1), 'eeee');
      const dateInIncomingFormat = formatDate(getDateDaysAway(fromDate, i - 1), 'yyyy-MM-dd');
      const nextBookingDate = findNextBookingDate(dateInIncomingFormat, map, FullProductionCode, ShowName);
      const date = formatDate(dateInIncomingFormat, 'dd/MM/yy');
      const weekNumber = calculateWeekNumber(fromDate, dateInIncomingFormat);
      if (i === 1 && weekDay !== 'Monday') {
        // +2 is for including currentday and sunday
        addWeekDetails(weekNumber, colNo, calculateRemainingDaysInWeek(weekDay) + 2);
        colNo++;
      }
      if (weekDay === 'Monday') {
        if (i > 1 && i < 7) {
          mergeRowCol.push({ row: [4, 4], col: [1, colNo - 1] });
        }
        const remainingDays = daysDiff - i;
        addWeekDetails(weekNumber, colNo, remainingDays < 5 ? remainingDays + 1 : 7);
        colNo++;
      }

      r4.push(`Week ${weekNumber}`);
      r5.push(date);
      r6.push(weekDay);

      if (weekDay === 'Monday') {
        cellColor.push({ cell: { rowNo: 5, colNo }, cellColor: COLOR_HEXCODE.LIGHT_BROWN });
        cellColor.push({ cell: { rowNo: 6, colNo }, cellColor: COLOR_HEXCODE.LIGHT_BROWN });
      }

      const key = getKey({ FullProductionCode, ShowName, EntryDate: dateInIncomingFormat });
      const value: SALES_SUMMARY = map[key];
      const nextValue: SALES_SUMMARY = nextBookingDate
        ? map[getKey({ FullProductionCode, ShowName, EntryDate: nextBookingDate })]
        : null;
      const scheduleValue: SCHEDULE_VIEW = scheduleMap[key];
      const statusCode = (value || scheduleValue)?.EntryStatusCode;
      const isCancelled = statusCode === 'X';
      const isSuspended = statusCode === 'S';
      if (!value) {
        if (
          scheduleValue &&
          (['Get In/Fit Up Day', 'Tech/Dress Day', 'Day Off', 'Travel Day', 'Rehearsal Day'].includes(
            scheduleValue?.EntryName,
          ) ||
            scheduleValue?.EntryName?.toLowerCase?.().includes?.('holiday'))
        ) {
          r7.push(scheduleValue.EntryName);
          cellColor.push({ cell: { rowNo: 7, colNo }, cellColor: COLOR_HEXCODE.RED, textColor: COLOR_HEXCODE.WHITE });
          cellColor.push({ cell: { rowNo: 8, colNo }, cellColor: COLOR_HEXCODE.RED, textColor: COLOR_HEXCODE.WHITE });
          mergeRowCol.push({ row: [7, 8], col: [colNo, colNo] });
          r8.push('');
          r9.push(``);
        } else {
          r7.push(scheduleValue?.Location || '');
          r8.push(scheduleValue?.EntryName || '');
          r9.push('');
        }
      } else {
        value.VenueCurrencySymbol = currencyCodeToSymbolMap[value.VenueCurrencyCode];
        if (!conversionRate && value.ConversionRate && Number(value.ConversionRate) !== 1) {
          conversionRate = value.ConversionRate;
        }
        r7.push(value.Location || scheduleValue?.Location || '');
        r8.push(value.EntryName || scheduleValue?.EntryName || '');
        if (nextValue && nextValue.EntryId === value.EntryId) {
          // This skips adding value for cell if it is repeating value
          r9.push(``);
        } else {
          r9.push(value.Value ? value.Value : '');
          // This adds blue background for Final Sales
          cellColor.push({
            cell: { rowNo: 9, colNo },
            cellColor: COLOR_HEXCODE.BLUE,
            ...(isCancelled && isSuspended && { textColor: COLOR_HEXCODE.GREY, cellColor: COLOR_HEXCODE.WHITE }),
            numFmt: (value.VenueCurrencySymbol || '') + '#,##0.00',
          });

          if (value.VenueCurrencySymbol && value.Value && !isCancelled && !isSuspended) {
            const val = totalOfCurrency[value.VenueCurrencySymbol];
            if (val || val === 0) {
              totalOfCurrency[value.VenueCurrencySymbol] = new Decimal(val)
                .plus(new Decimal(value.Value).toFixed(2))
                .toNumber();
            }
          }
        }
      }
      if (isCancelled || isSuspended) {
        cellColor.push({
          cell: { rowNo: 7, colNo },
          cellColor: isCancelled ? COLOR_HEXCODE.BLACK : COLOR_HEXCODE.PURPLE,
          textColor: COLOR_HEXCODE.WHITE,
        });
        cellColor.push({
          cell: { rowNo: 8, colNo },
          cellColor: isCancelled ? COLOR_HEXCODE.BLACK : COLOR_HEXCODE.PURPLE,
          textColor: COLOR_HEXCODE.WHITE,
        });
        cellColor.push({
          cell: { rowNo: 9, colNo },
          cellColor: COLOR_HEXCODE.WHITE,
          textColor: COLOR_HEXCODE.GREY,
        });
      }

      colNo++;
    }
    weekStartList.push(colNo);
    for (let i = 0; i <= 2; i++) {
      r4.push('Production Totals');
      r5.push('');
      if (i === 0) {
        r6.push(`(£1 = ${conversionRate || '0.8650'})`);
      } else {
        r6.push('');
      }

      if (i === 0) {
        r7.push('Total EUR');
        r9.push(totalOfCurrency['€'] ?? 0);
        cellColor.push({
          cell: { rowNo: 9, colNo },
          numFmt: '€#,##0.00',
        });
      } else if (i === 1) {
        r7.push('Total GBP');
        r9.push(totalOfCurrency['£'] ?? 0);
        cellColor.push({
          cell: { rowNo: 9, colNo },
          numFmt: '£#,##0.00',
        });
      } else {
        r7.push('Grand Total');
        r9.push(getTotalInPound({ totalOfCurrency, conversionRate }) ?? 0);
        cellColor.push({
          cell: { rowNo: 9, colNo },
          numFmt: '£#,##0.00',
        });
      }
      r8.push('');
      mergeRowCol.push({ row: [7, 8], col: [colNo, colNo] });
      colNo++;
    }
    weekStartList.push(colNo);
    mergeRowCol.push({ row: [4, 4], col: [colNo - 3, colNo - 1] });

    worksheet.addRow(r4);
    worksheet.addRow(r5);
    worksheet.addRow(r6);
    worksheet.addRow(r7);
    worksheet.addRow(r8);
    worksheet.addRow(r9);

    mergeRowCol.forEach((ele) => {
      const { row, col } = ele;
      try {
        worksheet.mergeCells(row[0], col[0], row[1], col[1]);
      } catch (e) {
        console.log(e?.message || 'Merging cells failed');
      }
    });

    const numberOfColumns = worksheet.columnCount;
    for (let i = 1; i <= numberOfColumns; i++) {
      worksheet.getColumn(i).width = 20;
    }

    worksheet.getRow(4).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(5).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(6).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getRow(7).alignment = { horizontal: 'center', vertical: 'middle' };

    worksheet.getRow(8).alignment = { horizontal: 'center', wrapText: true, vertical: 'middle' };
    worksheet.getRow(9).alignment = { horizontal: 'right', vertical: 'middle' };

    for (let rowNo = 4; rowNo <= 9; rowNo++) {
      // makeRowBold({worksheet, row: rowNo})
      worksheet.getRow(rowNo).font = { bold: false, size: 11, name: 'Calibri' };
    }

    worksheet.mergeCells(1, 1, 1, numberOfColumns);
    worksheet.mergeCells(2, 1, 2, numberOfColumns);
    firstRowFormatting({ worksheet });
    makeRowBold({ worksheet, row: 2 });

    for (let i = 1; i <= numberOfColumns; i++) {
      worksheet.getCell(4, i).border = {
        top: { style: 'thick' },
        left: { style: 'thick' },
        bottom: { style: 'thick' },
        right: { style: 'thick' },
      };
    }

    for (const col of weekStartList) {
      for (let row = 5; row <= 9; row++) {
        worksheet.getCell(row, col).border = {
          left: { style: 'thick' },
        };
      }
    }

    cellColor.forEach((ele) => {
      const {
        cell: { rowNo, colNo },
        cellColor,
        textColor,
        numFmt,
      } = ele;
      colorTextAndBGCell({
        worksheet,
        row: rowNo,
        col: colNo,
        ...(textColor && { textColor }),
        ...(cellColor && { cellColor }),
        ...(numFmt && { numFmt }),
      });
    });
    styleHeader({ worksheet, row: 1, bgColor: COLOR_HEXCODE.DARK_GREEN });
    styleHeader({ worksheet, row: 2, bgColor: COLOR_HEXCODE.DARK_GREEN });
    alignCellText({ worksheet, row: 1, col: 1, align: ALIGNMENT.LEFT });
    alignCellText({ worksheet, row: 2, col: 1, align: ALIGNMENT.LEFT });
    worksheet.getCell(1, 1).font = { size: 16, color: { argb: COLOR_HEXCODE.WHITE }, bold: true };
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
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);

    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: 'Error connecting to database' });
  }
};

export default handler;
