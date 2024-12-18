import ExcelJS from 'exceljs';
import { isArray } from 'radash';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { convertToPDF } from 'utils/report';
import formatInputDate from 'utils/dateInputFormat';
import { ALIGNMENT } from '../masterplan';
import { addWidthAsPerContent } from 'services/reportsService';
import getPrismaClient from 'lib/prisma';
import { getCurrencyFromBookingId } from 'services/venueCurrencyService';
import { getArchivedSalesList } from 'services/marketing/archivedSales';
import { addBorderToAllCells } from 'utils/export';

/**
 * creates excel from data
 * @param data
 * @param bookingInfo
 * @param productionName
 * @param venueAndDate
 * @returns
 */
const createExcelFromData = (data, bookingInfo, productionName, venueAndDate) => {
  // create a new ExcelJS Workbook
  const workbook = new ExcelJS.Workbook();
  // create worksheet with name 'Archived Sales'
  const worksheet = workbook.addWorksheet('Archived Sales');

  // create a map of booking id to production code for easy access
  const bookingToProdCode = bookingInfo.reduce((acc, item) => {
    acc[item.bookingId] = item;
    return acc;
  }, {});

  /**
   * creates header cell with given value and styles
   * @param cell
   * @param value
   * @param mergeAcross
   * @param fontSize
   */
  const createHeaderCell = (cell, value, mergeAcross = 1, fontSize = 12) => {
    cell.value = value;
    cell.font = { bold: true, size: fontSize, color: { argb: COLOR_HEXCODE.WHITE } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '41A29A' },
    };
    cell.alignment = { vertical: 'top', horizontal: 'center' };
    cell.border = {
      bottom: { style: 'thin', color: { argb: COLOR_HEXCODE.WHITE } },
      right: { style: 'thin', color: { argb: COLOR_HEXCODE.WHITE } },
    };
    if (mergeAcross > 1) {
      worksheet.mergeCells(cell.row, cell.col, cell.row, cell.col + mergeAcross - 1);
    }
  };

  // get all unique booking ids
  const bookingIds = [...new Set(data.flatMap((item) => item.data.map((d) => d.BookingId)))];

  const totalColumns = 1 + bookingIds.length * 3;

  const headerRow1 = worksheet.addRow(['Venue Archived Sales Report']);
  const headerRow2 = worksheet.addRow([productionName]);
  const headerRow3 = worksheet.addRow([venueAndDate]);

  // create header rows with production name, venue and date
  createHeaderCell(headerRow1.getCell(1), 'Venue Archived Sales Report', totalColumns, 16);
  createHeaderCell(headerRow2.getCell(1), productionName, totalColumns, 14);
  createHeaderCell(headerRow3.getCell(1), venueAndDate, totalColumns, 12);

  headerRow1.height = 30;
  headerRow2.height = 30;
  headerRow3.height = 30;

  const dataHeaderRow1 = worksheet.addRow(['']);
  const dataHeaderRow2 = worksheet.addRow(['']);
  const dataHeaderRow3 = worksheet.addRow(['Week']);
  dataHeaderRow1.height = 30;
  dataHeaderRow2.height = 30;
  dataHeaderRow3.height = 30;

  createHeaderCell(dataHeaderRow3.getCell(1), 'Week', 1, 12);

  let columnIndex = 2;
  // create header for each booking Id with 3 columns for date, seats sold and sales value
  bookingIds.forEach((bookingId) => {
    const info = bookingToProdCode[bookingId as string] || `Unknown (${bookingId})`;
    createHeaderCell(dataHeaderRow1.getCell(columnIndex), `${info.prodName}`, 3, 12);
    createHeaderCell(dataHeaderRow2.getCell(columnIndex), `No. of Performances: ${info.numPerfs}`, 3, 12);
    createHeaderCell(dataHeaderRow3.getCell(columnIndex), 'Date', 1, 12);
    createHeaderCell(dataHeaderRow3.getCell(columnIndex + 1), 'Seats Sold', 1, 12);
    createHeaderCell(dataHeaderRow3.getCell(columnIndex + 2), 'Sales Value', 1, 12);
    columnIndex += 3;
  });

  // loop through the data and add rows to the worksheet
  data.forEach((item, index) => {
    const isLastRow = index === data.length - 1;
    const rowData = [isLastRow ? 'Final' : `Week ${item.SetBookingWeekNum}`];
    const currencySymbols = [];
    // loop through each booking id and add date, seats and sales value to the row
    bookingIds.forEach((bookingId) => {
      const bookingData = item.data.find((d) => d.BookingId === bookingId) || {};
      rowData.push(bookingData.SetSalesFiguresDate ? formatInputDate(bookingData.SetSalesFiguresDate) : '');
      rowData.push(bookingData.Seats?.toNumber?.() || '-');
      rowData.push(bookingData.Value?.toNumber?.() || '-');
      currencySymbols.push(bookingData.currencySymbol);
    });

    const row = worksheet.addRow(rowData);

    row.height = 25;
    // loop through each cell in the row and apply styles based on the column number
    row.eachCell((cell, colNumber) => {
      // column number starts from 1
      // subtract first two cells for week and weekof
      const salesIndex = colNumber - 1;
      cell.alignment = { vertical: 'top', horizontal: 'center' };
      if (colNumber <= 1) {
        cell.font = { bold: true };
      }
      if (isLastRow) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: COLOR_HEXCODE.BLUE },
        };
      }

      if (colNumber > 1) {
        // Production Sales has 3 columns with date, seats, value
        const isSeatsCol = salesIndex % 3 === 2;
        const isValueCol = salesIndex % 3 === 0;
        if (isSeatsCol || isValueCol) {
          cell.alignment = {
            vertical: 'top',
            horizontal: ALIGNMENT.RIGHT,
          };
          cell.numFmt = '#,##0';
          if (isValueCol) {
            // all sale values are in prime numbered columns like 5, 7, 9, 11
            const index = Math.round(salesIndex / 3);
            const symbol = currencySymbols?.[index - 1] || '';
            cell.numFmt = symbol + '#,##0.00';
          }
        }
      }
    });
  });

  worksheet.getColumn(1).width = 10;
  worksheet.getColumn(2).width = 15;
  const numberOfColumns = worksheet.columnCount;
  // calculate the width of each column based on the content and set the width of each column
  addWidthAsPerContent({
    worksheet,
    fromColNumber: 3,
    toColNumber: numberOfColumns,
    startingColAsCharWIthCapsOn: 'C',
    minColWidth: 10,
    bufferWidth: 2,
    rowsToIgnore: 5,
    maxColWidth: Infinity,
  });
  addBorderToAllCells({ worksheet });
  return workbook;
};

/**
 * creates archived sales report
 * @param req
 * @param res
 * @returns
 */
const handler = async (req, res) => {
  if (req.method !== 'POST') {
    throw new Error('the method is not allowed');
  }

  const { bookingsSelection, productionName, venueAndDate, format } = req.body || {};

  if (!bookingsSelection || (isArray(bookingsSelection) && bookingsSelection.length === 0)) {
    throw new Error('Required params are missing');
  }

  const prisma = await getPrismaClient(req);
  // get booking ids from booking selection
  const bookingIds = bookingsSelection.map((booking) => booking.bookingId);

  // get currency symbol from booking id
  const currencySymbol = (await getCurrencyFromBookingId(req, bookingIds?.[0])) || '';
  // get archived sales list from booking ids
  const data = await getArchivedSalesList(bookingIds, currencySymbol, prisma);

  // create excel from the archived sales data
  const workbook = createExcelFromData(data, bookingsSelection, productionName, venueAndDate);
  const worksheet = workbook.getWorksheet('Archived Sales');
  const filename = `Archived Sales`;
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
  res.setHeader('Content-Disposition', ` attachment; filename=${filename}.xlsx`);

  return workbook.xlsx.write(res).then(() => {
    res.status(200).end();
  });
};

export default handler;
