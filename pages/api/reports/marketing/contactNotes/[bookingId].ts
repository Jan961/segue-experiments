import ExcelJS from 'exceljs';
import moment from 'moment';
import { getContactNotesByBookingId } from 'services/venueContactsService';
import { bookingContactNoteMapper } from 'lib/mappers';

const handler = async (req, res) => {
  const { bookingId } = req.query || {};

  if (req.method !== 'POST') {
    throw new Error('the method is not allowed');
  }

  const { productionName, venueAndDate } = req.body || {};

  if (!bookingId || !productionName || !venueAndDate) {
    throw new Error('Required params are missing');
  }

  const data = await getContactNotesByBookingId(parseInt(bookingId));

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Contact Notes');

  const createHeaderRow = (text: string, size: number) => {
    const row = worksheet.addRow([text]);
    row.height = 30;
    const cell = row.getCell(1);
    cell.font = { bold: true, size, color: { argb: 'FFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '41A29A' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
    };
    worksheet.mergeCells(`A${row.number}:E${row.number}`);
  };

  createHeaderRow(productionName, 16);
  createHeaderRow(venueAndDate, 14);
  createHeaderRow('Contact Notes Report', 12);

  const headerRow = worksheet.addRow(['Who', 'Date', 'Time', 'Actioned By', 'Notes']);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '41A29A' },
    };
    cell.font = { color: { argb: 'FFFFFF' }, bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
      right: { style: 'thin', color: { argb: 'FFFFFF' } },
    };
  });
  headerRow.height = 30;

  data.map(bookingContactNoteMapper).forEach((note) => {
    const row = worksheet.addRow([
      note.CoContactName,
      moment(note.ContactDate).format('DD/MM/YYYY'),
      moment(note.ContactDate).format('HH:mm'),
      note.UserId || '',
      note.Notes,
    ]);
    row.eachCell((cell, colNumber) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (colNumber === 5) {
        cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      }
    });
    row.height = 80;
  });

  const widths = [30, 10, 7, 20, 70];
  widths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=contact_notes.xlsx');

  return workbook.xlsx.write(res).then(() => {
    res.status(200).end();
  });
};

export default handler;
