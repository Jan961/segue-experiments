import ExcelJS from 'exceljs';
import { getContactNotesByBookingId } from 'services/venueContactsService';
import { bookingContactNoteMapper } from 'lib/mappers';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { NextApiRequest, NextApiResponse } from 'next';
import { createHeaderRow, getProductionAndVenueDetailsFromBookingId } from 'services/marketing/reports';
import { convertToPDF } from 'utils/report';
import { getAccountId, getEmailFromReq, getUsers } from 'services/userService';
import { objectify } from 'radash';
import { ALIGNMENT } from '../../masterplan';
import { dateTimeToTime, formatDate } from 'services/dateService';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { bookingId, format } = req.query || {};

  if (req.method !== 'POST') {
    throw new Error('the method is not allowed');
  }

  const { productionName, venueAndDate } = req.body || {};

  if (!bookingId || !productionName || !venueAndDate) {
    throw new Error('Required params are missing');
  }
  const email = await getEmailFromReq(req);
  const accountId = await getAccountId(email);
  const { prodCode, showName, venueName } = await getProductionAndVenueDetailsFromBookingId(
    parseInt(bookingId as string, 10),
    req,
  );
  const users = await getUsers(accountId);
  const usersMap = objectify(users, (user) => user.AccUserId);
  const data = await getContactNotesByBookingId(parseInt(bookingId as string, 10), req);
  const filename = `${prodCode} ${showName} ${venueName} Contact Notes`;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Contact Notes');

  createHeaderRow(worksheet, productionName, 16);
  createHeaderRow(worksheet, venueAndDate, 14);
  createHeaderRow(worksheet, 'Contact Notes Report', 12);

  const headerRow = worksheet.addRow(['Person Contacted', 'Date', 'Time', 'Actioned By', 'Notes']);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '41A29A' },
    };
    cell.font = { color: { argb: COLOR_HEXCODE.WHITE }, bold: true };
    cell.alignment = { vertical: ALIGNMENT.MIDDLE, horizontal: ALIGNMENT.CENTER };
    cell.border = {
      bottom: { style: 'thin', color: { argb: COLOR_HEXCODE.WHITE } },
      right: { style: 'thin', color: { argb: COLOR_HEXCODE.WHITE } },
    };
  });
  headerRow.height = 30;

  data.map(bookingContactNoteMapper).forEach((note) => {
    const { FirstName = '', LastName = '' } = usersMap[note.ActionAccUserId] || {};
    const actionedBy = `${FirstName || ''} ${LastName || ''}`;
    const row = worksheet.addRow([
      note.CoContactName,
      formatDate(note.ContactDate, 'dd/MM/yy'),
      dateTimeToTime(note.ContactDate),
      actionedBy || '',
      note.Notes,
    ]);
    row.eachCell((cell, colNumber) => {
      cell.alignment = { vertical: ALIGNMENT.TOP, horizontal: ALIGNMENT.CENTER };
      if (colNumber === 5) {
        cell.alignment = { vertical: ALIGNMENT.TOP, horizontal: ALIGNMENT.LEFT, wrapText: true };
      }
    });
    row.height = 80;
  });

  const widths = [30, 10, 7, 20, 70];
  widths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

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
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  return workbook.xlsx.write(res).then(() => {
    res.status(200).end();
  });
};

export default handler;
