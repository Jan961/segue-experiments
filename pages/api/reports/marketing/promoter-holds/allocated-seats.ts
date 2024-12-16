import ExcelJS from 'exceljs';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { NextApiRequest, NextApiResponse } from 'next';
import { createHeaderRow, getProductionAndVenueDetailsFromBookingId } from 'services/marketing/reports';
import { addWidthAsPerContent } from 'services/reportsService';
import { getAccountId, getEmailFromReq, getUsers } from 'services/userService';
import { objectify } from 'radash';
import { getPerformanceCompAllocationsByBookingId } from 'services/marketing/promoterHoldsService';

/**
 * creates allocated seats
 * @param req
 * @param res
 * @returns
 */
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
  // get production and venue details from booking id
  const { prodCode, showName, venueName } = await getProductionAndVenueDetailsFromBookingId(
    parseInt(bookingId as string, 10),
    req,
  );
  // get user details by account id
  const users = await getUsers(accountId);
  // create map of users with AccUserId as key for easy access
  const usersMap = objectify(users, (user) => user.AccUserId);
  // get allocations data by booking id
  const { allocations: data } = await getPerformanceCompAllocationsByBookingId(parseInt(bookingId as string, 10), req);
  const fileName = `${prodCode} ${showName} ${venueName} Allocated Seats`;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Allocated Seats');

  // create header rows with production name, venue and date
  createHeaderRow(worksheet, productionName, 16, 'I');
  createHeaderRow(worksheet, venueAndDate, 14, 'I');
  createHeaderRow(worksheet, 'Allocated Seats Report', 12, 'I');

  // add column headers
  const headerRow = worksheet.addRow([
    'Perf Date',
    'Perf Time',
    'Name',
    'Email',
    'Arranged by',
    'Comments',
    'Seats',
    'Allocated',
    'Venue Confirmation Notes',
  ]);
  // loop through each cell in column header row and apply styles
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
  // loop through the allocated seats data and add rows to the worksheet
  data.forEach(
    ({
      date,
      time,
      TicketHolderEmail,
      TicketHolderName,
      Comments,
      ArrangedByAccUserId,
      Seats,
      SeatsAllocated,
      VenueConfirmationNotes,
    }) => {
      // get the first name and last name of the user who arranged the seats
      const { FirstName = '', LastName = '' } = usersMap[ArrangedByAccUserId] || {};
      const arrangedBy = `${FirstName || ''} ${LastName || ''}`;
      // add a row to the worksheet
      const row = worksheet.addRow([
        date,
        time,
        TicketHolderName,
        TicketHolderEmail,
        arrangedBy,
        Comments,
        Seats,
        SeatsAllocated,
        VenueConfirmationNotes,
      ]);
      // style each cell in the row with vertical alignment middle and horizontal alignment center
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        if (colNumber === 3) {
          cell.alignment = { wrapText: true };
        }
      });
    },
  );

  const numberOfColumns = worksheet.columnCount;
  // calculate the width of each column based on the content and set the width of each column
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
