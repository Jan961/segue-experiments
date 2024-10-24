import ExcelJS from 'exceljs';
import getPrismaClient from 'lib/prisma';
import moment from 'moment';
import Decimal from 'decimal.js';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { ALIGNMENT, alignCellText, styleHeader } from './masterplan';
import { addBorderToAllCells, getExportedAtTitle } from 'utils/export';
import { currencyCodeToSymbolMap } from 'config/Reports';
import { convertToPDF } from 'utils/report';
import { BOOK_STATUS_CODES, SALES_TYPE_NAME } from 'types/MarketingTypes';

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
    cell.font = { color: { argb: 'ffffffff' }, bold: true };
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
const formatDate = (date) => moment(date).format('DD/MM/YY');

const getTotalInPound = ({ totalOfCurrency, conversionRate }) => {
  const euroVal = totalOfCurrency['€'];
  const finalValOfEuro = euroVal ? new Decimal(euroVal).mul(conversionRate).toFixed(2) : 0;
  return totalOfCurrency['£'] ? new Decimal(totalOfCurrency['£']).plus(finalValOfEuro).toFixed(2) : finalValOfEuro;
};

const handler = async (req, res) => {
  try {
    const prisma = await getPrismaClient(req);
    const timezoneOffset = parseInt(req.headers.timezoneoffset as string, 10) || 0;
    const { productionId, format } = req.body || {};
    if (!productionId) {
      throw new Error('Params are missing');
    }
    const data = await prisma.salesSummaryView.findMany({
      where: {
        ProductionId: productionId,
        SaleTypeName: SALES_TYPE_NAME.GENERAL_SALES,
      },
    });
    let filename = 'Gross Sales';
    const workbook = new ExcelJS.Workbook();
    const formattedData = data.map((x) => ({
      ...x,
      Value: x.Value?.toNumber?.() || 0,
      EntryDate: moment(x.EntryDate).format('YYYY-MM-DD'),
      ProductionStartDate: moment(x.ProductionStartDate).format('YYYY-MM-DD'),
      ProductionEndDate: moment(x.ProductionEndDate).format('YYYY-MM-DD'),
    }));

    const worksheet = workbook.addWorksheet('Gross Sales', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    });

    if (!formattedData?.length) {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);

      await workbook.xlsx.write(res).then(() => {
        res.end();
      });
      return;
    }

    const { FullProductionCode = '', ShowName = '' } = data?.[0] || {};
    filename = `${FullProductionCode} ${ShowName} Gross Sales`;
    worksheet.addRow([`${filename}`]);
    const exportedAtTitle = getExportedAtTitle(timezoneOffset);
    worksheet.addRow([exportedAtTitle]);

    worksheet.addRow([]);

    const map: { [key: string]: SALES_SUMMARY } = formattedData.reduce((acc, x) => ({ ...acc, [getKey(x)]: x }), {});

    const { ProductionStartDate: fromDate, ProductionEndDate: toDate } = data[0];

    const daysDiff = moment(toDate).diff(moment(fromDate), 'days');

    let colNo = 1;
    let weekPending = false;
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
    let prevValue: SALES_SUMMARY;
    for (let i = 1; i <= daysDiff || weekPending; i++) {
      weekPending = true;

      const j = i + 1;
      const weekDay = moment(moment(fromDate).add(i - 1, 'day')).format('dddd');
      const dateInIncomingFormat = moment(moment(fromDate).add(i - 1, 'day')).format('YYYY-MM-DD');
      const nextDateInIncomingFormat = moment(moment(fromDate).add(j - 1, 'day')).format('YYYY-MM-DD');
      const date = formatDate(dateInIncomingFormat);

      if (i % 7 === 1) {
        r4.push(`Week ${Math.floor(i / 7) + 1}`);
        r5.push('');
        r6.push('');
        r8.push('');
        r9.push('');

        mergeRowCol.push({ row: [7, 8], col: [colNo, colNo] });
        mergeRowCol.push({ row: [4, 4], col: [colNo, colNo + 7] });

        r7.push('Weekly Costs');
        colNo++;
      }

      r4.push(`Week ${Math.floor(i / 7) + 1}`);
      r5.push(date);
      r6.push(weekDay);

      if (weekDay === 'Monday') {
        cellColor.push({ cell: { rowNo: 5, colNo }, cellColor: COLOR_HEXCODE.ORANGE });
        cellColor.push({ cell: { rowNo: 6, colNo }, cellColor: COLOR_HEXCODE.ORANGE });
      }

      const key = getKey({ FullProductionCode, ShowName, EntryDate: dateInIncomingFormat });
      const nextKey = getKey({ FullProductionCode, ShowName, EntryDate: nextDateInIncomingFormat });
      const value: SALES_SUMMARY = map[key];
      const nextValue: SALES_SUMMARY = map[nextKey];
      if (!value) {
        r7.push('');
        r8.push('');
        r9.push('');
      } else {
        value.VenueCurrencySymbol = currencyCodeToSymbolMap[value.VenueCurrencyCode];
        if (!conversionRate && value.ConversionRate && Number(value.ConversionRate) !== 1) {
          conversionRate = value.ConversionRate;
        }
        r7.push(value.Location || '');
        r8.push(value.EntryName || '');
        if (nextValue && nextValue.EntryId === value.EntryId) {
          // This skips adding value for cell if it is repeating value
          r9.push(``);
        } else {
          r9.push(value.Value ? value.Value : '');
          // This adds blue background for Final Sales
          if (prevValue && nextValue && prevValue.EntryId === value.EntryId && value.EntryId !== nextValue.EntryId) {
            cellColor.push({
              cell: { rowNo: 9, colNo },
              cellColor: COLOR_HEXCODE.BLUE,
              numFmt: (value.VenueCurrencySymbol || '') + '#,##0.00',
            });
          } else {
            cellColor.push({
              cell: { rowNo: 9, colNo },
              ...(value.EntryStatusCode === 'X' && { cellColor: COLOR_HEXCODE.GREY }),
              numFmt: (value.VenueCurrencySymbol || '') + '#,##0.00',
            });
          }
          if (value.VenueCurrencySymbol && value.Value && value.EntryStatusCode !== 'X') {
            const val = totalOfCurrency[value.VenueCurrencySymbol];
            if (val || val === 0) {
              totalOfCurrency[value.VenueCurrencySymbol] = new Decimal(val)
                .plus(new Decimal(value.Value).toFixed(2))
                .toFixed(2) as any as number;
            }
          }
        }
        if (
          ['Get In/Fit Up Day', 'Tech/Dress Day', 'Day Off', 'Travel Day'].includes(value.EntryName) ||
          value.EntryName.toLowerCase().includes('holiday')
        ) {
          cellColor.push({ cell: { rowNo: 7, colNo }, cellColor: COLOR_HEXCODE.RED, textColor: COLOR_HEXCODE.WHITE });
          cellColor.push({ cell: { rowNo: 8, colNo }, cellColor: COLOR_HEXCODE.RED, textColor: COLOR_HEXCODE.WHITE });
        }
        if (value.EntryStatusCode === 'X') {
          cellColor.push({ cell: { rowNo: 7, colNo }, cellColor: COLOR_HEXCODE.BLACK, textColor: COLOR_HEXCODE.WHITE });
          cellColor.push({ cell: { rowNo: 8, colNo }, cellColor: COLOR_HEXCODE.BLACK, textColor: COLOR_HEXCODE.WHITE });
        }
      }

      if (i % 7 === 0) {
        weekPending = false;
      }
      colNo++;
      prevValue = value;
    }

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
        r9.push(totalOfCurrency['€'] ? `€${String(totalOfCurrency['€'])}` : '');
      } else if (i === 1) {
        r7.push('Total GBP');
        r9.push(totalOfCurrency['£'] ? `£${String(totalOfCurrency['£'])}` : '');
      } else {
        r7.push('Grand Total');
        r9.push(`£${getTotalInPound({ totalOfCurrency, conversionRate })}`);
      }
      r8.push('');

      mergeRowCol.push({ row: [7, 8], col: [colNo + i, colNo + i] });
    }

    mergeRowCol.push({ row: [4, 4], col: [colNo, colNo + 2] });

    worksheet.addRow(r4);
    worksheet.addRow(r5);
    worksheet.addRow(r6);
    worksheet.addRow(r7);
    worksheet.addRow(r8);
    worksheet.addRow(r9);

    mergeRowCol.forEach((ele) => {
      const { row, col } = ele;
      worksheet.mergeCells(row[0], col[0], row[1], col[1]);
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

    for (let i = 1; i <= numberOfColumns; i++) {
      if (i % 8 === 1) {
        for (let row = 5; row <= 9; row++) {
          worksheet.getCell(row, i).border = {
            left: { style: 'thick' },
          };
        }
      }
    }
    for (let row = 5; row <= 9; row++) {
      worksheet.getCell(row, colNo + 3).border = {
        left: { style: 'thick' },
      };
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
    addBorderToAllCells({ worksheet });
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
