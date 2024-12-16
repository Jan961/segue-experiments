import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';
import { COLOR_HEXCODE } from 'services/salesSummaryService';

/**
 * get production and venue details from booking id
 * @param bookingId
 * @param req
 * @returns
 */
export const getProductionAndVenueDetailsFromBookingId = async (bookingId: number, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  const result = await prisma.scheduleView.findFirst({
    where: {
      EntryType: 'Booking',
      ...(bookingId ? { EntryId: bookingId } : {}),
    },
    select: {
      FullProductionCode: true,
      ShowName: true,
      EntryName: true,
    },
  });

  if (result) {
    const { FullProductionCode, ShowName, EntryName } = result;
    return {
      prodCode: FullProductionCode,
      showName: ShowName,
      venueName: EntryName,
    };
  }

  return {};
};

/**
 * creates header row with given text and formats it in white color with green background
 * @param worksheet
 * @param text
 * @param size
 * @param expandTillColumn
 */
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
