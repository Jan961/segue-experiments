import ExcelJS from 'exceljs';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { NextApiRequest, NextApiResponse } from 'next';
import { createHeaderRow, getProductionAndVenueDetailsFromBookingId } from 'services/marketing/reports';
import { addWidthAsPerContent } from 'services/reportsService';
import { getAccountId, getEmailFromReq, getUsers } from 'services/userService';
import { objectify } from 'radash';
import { getPerformanceCompAllocationsByBookingId } from 'services/marketing/promoterHoldsService';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    throw new Error('the method is not allowed');
  }

  const { productionName, venueAndDate, bookingId } = req.body || {};

  if (!bookingId || !productionName || !venueAndDate) {
    throw new Error('Required params are missing');
  }
  const email = await getEmailFromReq(req);
  const accountId = await getAccountId(email);
  const { prodCode, showName, venueName } = await getProductionAndVenueDetailsFromBookingId(
    parseInt(bookingId as string, 10),
  );
  const users = await getUsers(accountId);
  const usersMap = objectify(users, (user) => user.Id);
  const { allocations: data } = await getPerformanceCompAllocationsByBookingId(parseInt(bookingId as string, 10));
  const fileName = `${prodCode} ${showName} ${venueName} Allocated Seats`;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Allocated Seats');

  createHeaderRow(worksheet, productionName, 16, 'H');
  createHeaderRow(worksheet, venueAndDate, 14, 'H');
  createHeaderRow(worksheet, 'Allocated Seats Report', 12, 'H');

  const headerRow = worksheet.addRow([
    'Perf Date',
    'Perf Time',
    'Name / Email of Person \r\n Receiving Tickets',
    'Arranged by',
    'Comments',
    'Seats',
    'Allocated',
    'Venue Confirmation Notes',
  ]);
  headerRow.eachCell((cell, colNumber) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '41A29A' },
    };
    cell.font = { color: { argb: COLOR_HEXCODE.WHITE }, bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      bottom: { style: 'thin', color: { argb: COLOR_HEXCODE.WHITE } },
      right: { style: 'thin', color: { argb: COLOR_HEXCODE.WHITE } },
    };
    if (colNumber === 3) {
      cell.alignment = { horizontal: 'center', wrapText: true };
    }
  });
  data.forEach(
    ({
      date,
      time,
      TicketHolderEmail,
      TicketHolderName,
      Comments,
      ArrangedById,
      Seats,
      SeatsAllocated,
      VenueConfirmationNotes,
    }) => {
      const { FirstName = '', LastName = '' } = usersMap[ArrangedById] || {};
      const arrangedBy = `${FirstName || ''} ${LastName || ''}`;
      const row = worksheet.addRow([
        date,
        time,
        `${TicketHolderEmail} \r\n ${TicketHolderName}`,
        arrangedBy,
        Comments,
        Seats,
        SeatsAllocated,
        VenueConfirmationNotes,
      ]);
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        if (colNumber === 3) {
          cell.alignment = { wrapText: true };
        }
      });
    },
  );

  const numberOfColumns = worksheet.columnCount;
  addWidthAsPerContent({
    worksheet,
    fromColNumber: 1,
    toColNumber: numberOfColumns,
    startingColAsCharWIthCapsOn: 'A',
    minColWidth: 10,
    bufferWidth: 2,
    rowsToIgnore: 3,
    maxColWidth: Infinity,
  });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  return workbook.xlsx.write(res).then(() => {
    res.status(200).end();
  });
};

export default handler;
