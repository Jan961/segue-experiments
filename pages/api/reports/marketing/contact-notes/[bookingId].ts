import { Prisma } from '@prisma/client';
import ExcelJS from 'exceljs';
import moment from 'moment';
import prisma from 'lib/prisma';
import { getContactNotesByBookingId } from 'services/venueContactsService';
import { bookingContactNoteMapper } from 'lib/mappers';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { NextApiRequest, NextApiResponse } from 'next';

const getProductionAndVenueDetailsFromBookingId = async (bookingId: number) => {
  const conditions: Prisma.Sql[] = [Prisma.sql` EntryType=${'Booking'}`];
  if (bookingId) {
    conditions.push(Prisma.sql` EntryId=${bookingId}`);
  }
  const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty;
  const results: any[] =
    await prisma.$queryRaw`SELECT FullProductionCode, ShowName, EntryName FROM ScheduleView ${where}`;
  if (results.length) {
    const { FullProductionCode, ShowName, EntryName } = results[0];
    return {
      prodCode: FullProductionCode,
      showName: ShowName,
      venueName: EntryName,
    };
  }
  return {};
};

const createHeaderRow = (worksheet: any, text: string, size: number) => {
  const row = worksheet.addRow([text]);
  row.height = 30;
  const cell = row.getCell(1);
  cell.font = { bold: true, size, color: { argb: COLOR_HEXCODE.WHITE } };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '41A29A' },
  };
  cell.alignment = { vertical: 'middle', horizontal: 'center' };
  cell.border = {
    bottom: { style: 'thin', color: { argb: COLOR_HEXCODE.WHITE } },
  };
  worksheet.mergeCells(`A${row.number}:E${row.number}`);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { bookingId } = req.query || {};

  if (req.method !== 'POST') {
    throw new Error('the method is not allowed');
  }

  const { productionName, venueAndDate } = req.body || {};

  if (!bookingId || !productionName || !venueAndDate) {
    throw new Error('Required params are missing');
  }
  const { prodCode, showName, venueName } = await getProductionAndVenueDetailsFromBookingId(
    parseInt(bookingId as string, 10),
  );
  const data = await getContactNotesByBookingId(parseInt(bookingId as string, 10));
  const fileName = `${prodCode} ${showName} ${venueName} Contact Notes`;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Contact Notes');

  createHeaderRow(worksheet, productionName, 16);
  createHeaderRow(worksheet, venueAndDate, 14);
  createHeaderRow(worksheet, 'Contact Notes Report', 12);

  const headerRow = worksheet.addRow(['Who', 'Date', 'Time', 'Actioned By', 'Notes']);
  headerRow.eachCell((cell) => {
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
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  return workbook.xlsx.write(res).then(() => {
    res.status(200).end();
  });
};

export default handler;
