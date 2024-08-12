import { Prisma } from 'prisma/generated/prisma-client';
import prisma from 'lib/prisma';
import { COLOR_HEXCODE } from 'services/salesSummaryService';

export const getProductionAndVenueDetailsFromBookingId = async (bookingId: number) => {
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

export const createHeaderRow = (worksheet: any, text: string, size: number, expandTillColumn = 'E') => {
  const row = worksheet.addRow([text]);
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
  worksheet.mergeCells(`A${row.number}:${expandTillColumn}${row.number}`);
};
