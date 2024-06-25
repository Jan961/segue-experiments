import ExcelJS from 'exceljs';
import moment from 'moment';
import { getArchivedSalesList } from 'pages/api/marketing/sales/read/archived';
import { isArray } from 'radash';
import { COLOR_HEXCODE } from 'services/salesSummaryService';

const createExcelFromData = (data, bookingInfo, productionName, venueAndDate) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Booking Data');

  const bookingToProdCode = bookingInfo.reduce((acc, item) => {
    acc[item.bookingId] = item.prodCode;
    return acc;
  }, {});

  const createHeaderCell = (cell, value, mergeAcross = 1, fontSize = 12) => {
    cell.value = value;
    cell.font = { bold: true, size: fontSize, color: { argb: COLOR_HEXCODE.WHITE } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '41A29A' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      bottom: { style: 'thin', color: { argb: COLOR_HEXCODE.WHITE } },
      right: { style: 'thin', color: { argb: COLOR_HEXCODE.WHITE } },
    };
    if (mergeAcross > 1) {
      worksheet.mergeCells(cell.row, cell.col, cell.row, cell.col + mergeAcross - 1);
    }
  };

  const bookingIds = [...new Set(data.flatMap((item) => item.data.map((d) => d.BookingId)))];

  const totalColumns = 2 + bookingIds.length * 2;

  const headerRow1 = worksheet.addRow(['Venue Archived Sales Report']);
  const headerRow2 = worksheet.addRow([productionName]);
  const headerRow3 = worksheet.addRow([venueAndDate]);
  const emptyRow = worksheet.addRow([]);

  createHeaderCell(headerRow1.getCell(1), 'Venue Archived Sales Report', totalColumns, 16);
  createHeaderCell(headerRow2.getCell(1), productionName, totalColumns, 16);
  createHeaderCell(headerRow3.getCell(1), venueAndDate, totalColumns, 16);

  headerRow1.height = 30;
  headerRow2.height = 30;
  headerRow3.height = 30;
  emptyRow.height = 15;

  const dataHeaderRow1 = worksheet.addRow(['', '']);
  const dataHeaderRow2 = worksheet.addRow(['Week', 'Week of']);
  dataHeaderRow1.height = 30;
  dataHeaderRow2.height = 30;

  createHeaderCell(dataHeaderRow2.getCell(1), 'Week', 1, 12);
  createHeaderCell(dataHeaderRow2.getCell(2), 'Week of', 1, 12);

  let columnIndex = 3;
  bookingIds.forEach((bookingId) => {
    const prodCode = bookingToProdCode[bookingId as string] || `Unknown (${bookingId})`;
    createHeaderCell(dataHeaderRow1.getCell(columnIndex), prodCode, 2, 12);
    createHeaderCell(dataHeaderRow2.getCell(columnIndex), 'Seats', 1, 12);
    createHeaderCell(dataHeaderRow2.getCell(columnIndex + 1), 'Value', 1, 12);
    columnIndex += 2;
  });

  data.forEach((item, index) => {
    const isLastRow = index === data.length - 1;
    const rowData = [
      isLastRow ? 'Final' : `Week ${item.SetBookingWeekNum}`,
      moment(item.SetProductionWeekDate).format('DD/MM/YYYY'),
    ];

    bookingIds.forEach((bookingId) => {
      const bookingData = item.data.find((d) => d.BookingId === bookingId) || {};
      rowData.push(bookingData.Seats ? parseInt(bookingData.Seats).toString() : '0');
      rowData.push(bookingData.ValueWithCurrencySymbol || 'No Sales');
    });

    const row = worksheet.addRow(rowData);

    row.height = 25;
    row.eachCell((cell, colNumber) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (colNumber <= 2) {
        cell.font = { bold: true };
      }
      if (isLastRow) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: COLOR_HEXCODE.BLUE },
        };
      }

      if (colNumber > 2) {
        if (item.SetNotOnSale) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: COLOR_HEXCODE.RED },
          };
        } else if (item.SetBrochureReleased) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: COLOR_HEXCODE.YELLOW },
          };
        } else if (item.SetSingleSeats) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: COLOR_HEXCODE.DARK_GREEN },
          };
        }
      }
    });
  });

  worksheet.getColumn(1).width = 10;
  worksheet.getColumn(2).width = 15;
  for (let i = 3; i <= columnIndex - 1; i++) {
    worksheet.getColumn(i).width = 15;
  }

  return workbook;
};

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    throw new Error('the method is not allowed');
  }

  const { bookingsSelection, productionName, venueAndDate } = req.body || {};

  if (!bookingsSelection || (isArray(bookingsSelection) && bookingsSelection.length === 0)) {
    throw new Error('Required params are missing');
  }

  const bookingIds = bookingsSelection.map((booking) => booking.bookingId);

  const data = await getArchivedSalesList(bookingIds);

  const workbook = createExcelFromData(data, bookingsSelection, productionName, venueAndDate);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=booking_data.xlsx');

  return workbook.xlsx.write(res).then(() => {
    res.status(200).end();
  });
};

export default handler;
