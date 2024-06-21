import { Prisma } from '@prisma/client';
import ExcelJS from 'exceljs';
import prisma from 'lib/prisma';
import moment from 'moment';
import Decimal from 'decimal.js';
import { COLOR_HEXCODE } from 'services/salesSummaryService';

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
  Value: number | null;
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
}: {
  worksheet: any;
  row: number;
  col: number;
  textColor?: COLOR_HEXCODE;
  cellColor?: COLOR_HEXCODE;
}) => {
  if (!textColor && !cellColor) {
    return;
  }
  const cell = worksheet.getCell(row, col);
  if (textColor) {
    cell.font = { color: { argb: 'ffffffff' }, bold: true };
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
  const { productionId } = req.body || {};

  if (!productionId) {
    throw new Error('Params are missing');
  }
  const conditions: Prisma.Sql[] = [];
  if (productionId) {
    conditions.push(Prisma.sql` ProductionId=${productionId}`);
  }
  const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty;

  const data: SALES_SUMMARY[] = await prisma.$queryRaw`select * FROM SalesSummaryView ${where} order by EntryDate;`;

  const workbook = new ExcelJS.Workbook();
  const formattedData = data.map((x) => ({
    ...x,
    EntryDate: moment(x.EntryDate).format('YYYY-MM-DD'),
    ProductionStartDate: moment(x.ProductionStartDate).format('YYYY-MM-DD'),
    ProductionEndDate: moment(x.ProductionEndDate).format('YYYY-MM-DD'),
  }));

  const worksheet = workbook.addWorksheet('My Sales', {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
  });

  if (!formattedData?.length) {
    const filename = 'Production Gross Sales.xlsx';
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res).then(() => {
      res.end();
    });
    return;
  }

  const { ShowName, FullProductionCode } = data[0];
  worksheet.addRow([`${ShowName} (${FullProductionCode})`]);
  const date = new Date();
  worksheet.addRow([`Exported: ${moment(date).format('DD/MM/YYYY')} at ${moment(date).format('hh:mm')}`]);

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
  const r9: string[] = [];

  const mergeRowCol: { row: number[]; col: number[] }[] = [];
  const cellColor: { cell: { rowNo: number; colNo: number }; cellColor?: COLOR_HEXCODE; textColor?: COLOR_HEXCODE }[] =
    [];
  const totalOfCurrency: { [key: string]: number } = { '£': 0, '€': 0 };
  for (let i = 1; i <= daysDiff || weekPending; i++) {
    weekPending = true;

    const weekDay = moment(moment(fromDate).add(i - 1, 'day')).format('dddd');
    const dateInIncomingFormat = moment(moment(fromDate).add(i - 1, 'day')).format('YYYY-MM-DD');
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
    const value: SALES_SUMMARY = map[key];

    if (!value) {
      r7.push('');
      r8.push('');
      r9.push('');
    } else {
      if (!conversionRate && value.ConversionRate && Number(value.ConversionRate) !== 1) {
        conversionRate = value.ConversionRate;
      }
      r7.push(value.Location || '');
      r8.push(value.EntryName || '');
      r9.push(value.VenueCurrencySymbol && value.Value ? `${value.VenueCurrencySymbol}${value.Value}` : '');
      if (value.VenueCurrencySymbol && value.Value) {
        const val = totalOfCurrency[value.VenueCurrencySymbol];
        if (val || val === 0) {
          totalOfCurrency[value.VenueCurrencySymbol] = new Decimal(val)
            .plus(new Decimal(value.Value).toFixed(2))
            .toFixed(2) as any as number;
        }
      }
      if (
        ['Get In/Fit Up Day', 'Tech/Dress Day', 'Day Off', 'Travel Day'].includes(value.EntryName) ||
        value.EntryName.toLowerCase().includes('holiday')
      ) {
        cellColor.push({ cell: { rowNo: 7, colNo }, cellColor: COLOR_HEXCODE.RED, textColor: COLOR_HEXCODE.WHITE });
        cellColor.push({ cell: { rowNo: 8, colNo }, cellColor: COLOR_HEXCODE.RED, textColor: COLOR_HEXCODE.WHITE });
      }
    }

    if (i % 7 === 0) {
      weekPending = false;
    }
    colNo++;
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
    worksheet.getRow(rowNo).font = { bold: true, size: 12, name: 'Times New Roman' };
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
      for (let row = 5; row <= 8; row++) {
        worksheet.getCell(row, i).border = {
          left: { style: 'thick' },
        };
      }
    }
  }
  for (let row = 5; row <= 8; row++) {
    worksheet.getCell(row, colNo + 3).border = {
      left: { style: 'thick' },
    };
  }

  cellColor.forEach((ele) => {
    const {
      cell: { rowNo, colNo },
      cellColor,
      textColor,
    } = ele;
    colorTextAndBGCell({
      worksheet,
      row: rowNo,
      col: colNo,
      ...(textColor && { textColor }),
      ...(cellColor && { cellColor }),
    });
  });

  const filename = 'Production Gross Sales.xlsx';
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  workbook.xlsx.write(res).then(() => {
    res.end();
  });
};

export default handler;
