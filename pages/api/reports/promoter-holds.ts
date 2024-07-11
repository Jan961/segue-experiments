import { Prisma } from '@prisma/client';
import ExcelJS from 'exceljs';
import prisma from 'lib/prisma';
import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import { all } from 'radash';
import { toSql } from 'services/dateService';
import { getProductionWithContent } from 'services/productionService';
import { addWidthAsPerContent } from 'services/reportsService';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { getExportedAtTitle } from 'utils/export';

type TPromoter = {
  ProductionId: number;
  FullProductionCode: string;
  VenueCode: string;
  VenueName: string;
  BookingId: number;
  PerformanceDate: string;
  PerformanceTime: string;
  AvailableCompSeats: number | null;
  AvailableCompNotes: string | null;
  CompAllocationSeats: number | null;
  CompAllocationTicketHolderName: string | null;
  CompAllocationSeatsAllocated: number | null;
  CompAllocationTicketHolderEmail: string | null;
  CompAllocationComments: string | null;
  CompAllocationRequestedBy: string | null;
  CompAllocationArrangedBy: string | null;
  CompAllocationVenueConfirmationNotes: string | null;
};

const alignColumnTextRight = ({ worksheet, colAsChar }: { worksheet: any; colAsChar: string }) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: 'right' };
  });
};

const alignCellTextCenter = ({ worksheet, colAsChar }: { worksheet: any; colAsChar: string }) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: 'center' };
  });
};

export const makeRowTextBoldAndAllignLeft = ({
  worksheet,
  row,
  numberOfColumns,
  bgColor = COLOR_HEXCODE.DARK_ORANGE,
}: {
  worksheet: any;
  row: number;
  numberOfColumns?: number;
  bgColor?: COLOR_HEXCODE;
}) => {
  const totalColumns = numberOfColumns ?? worksheet.columnCount;
  for (let col = 1; col <= totalColumns; col++) {
    const cell = worksheet.getCell(row, col);
    cell.font = { bold: true, color: { argb: COLOR_HEXCODE.WHITE } };
    cell.alignment = { horizontal: 'left' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bgColor },
    };
    // cell.border = {
    //   top: { style: 'double', color: { argb: COLOR_HEXCODE.WHITE } },
    //   left: { style: 'double', color: { argb: COLOR_HEXCODE.WHITE } },
    //   bottom: { style: 'double', color: { argb: COLOR_HEXCODE.WHITE } },
    //   right: { style: 'double', color: { argb: COLOR_HEXCODE.WHITE } }
    // }
  }
};

type ProductionDetails = {
  Show?: {
    Name?: string;
  };
};

// TODO - Issue with Performance Time
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const timezoneOffset = parseInt(req.headers.timezoneoffset as string, 10) || 0;
  let { productionCode = '', fromDate, toDate, venue, productionId } = req.body || {};
  const email = await getEmailFromReq(req);
  const access = await checkAccess(email, { ProductionId: productionId });
  if (!access) return res.status(401).end();

  const workbook = new ExcelJS.Workbook();

  const conditions: Prisma.Sql[] = [];
  if (productionId) {
    conditions.push(Prisma.sql`ProductionId = ${productionId}`);
  }
  if (venue) {
    conditions.push(Prisma.sql`VenueCode = ${venue}`);
  }
  if (fromDate && toDate) {
    fromDate = toSql(fromDate);
    toDate = toSql(toDate);
    conditions.push(Prisma.sql`PerformanceDate BETWEEN ${fromDate} AND ${toDate}`);
  }
  const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty;
  const [data, productionDetails] = await all([
    prisma.$queryRaw<TPromoter[]>`select * FROM PromoterHoldsView ${where} order by PerformanceDate;`,
    getProductionWithContent(productionId),
  ]);
  const { VenueName } = data?.[0] || {};
  const showName = (productionDetails as ProductionDetails)?.Show?.Name || '';
  const fileName = `${productionCode} ${showName} ${VenueName}`;
  const worksheet = workbook.addWorksheet('My Sales', {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    views: [{ state: 'frozen', xSplit: 5, ySplit: 4 }],
  });

  worksheet.addRow(['PROMOTER HOLDS']);
  const exportedAtTitle = getExportedAtTitle(timezoneOffset);
  worksheet.addRow([exportedAtTitle]);
  worksheet.addRow(['PRODUCTION', 'VENUE', '', 'SHOW', '', 'AVAILABLE', '', 'ALLOCATED', '']);
  worksheet.addRow([
    'CODE',
    'CODE',
    'NAME',
    'DATE',
    'TIME',
    'SEATS',
    'NOTES',
    'SEATS',
    'NAME',
    'SEAT NUMBERS',
    'EMAIL',
    'NOTES',
    'REQUESTED BY',
    'ARRANGED BY',
    'VENUE CONFIRMATION',
  ]);

  (data as TPromoter[]).forEach((x) => {
    const productionCode = x.FullProductionCode || '';
    const venueCode = x.VenueCode || '';
    const venueName = x.VenueName || '';
    const showDate = x.PerformanceDate ? moment(x.PerformanceDate).format('DD/MM/YY') : '';
    const showTime = x.PerformanceTime ? moment(x.PerformanceTime).format('hh:mm') : '';
    const availableSeats = x.AvailableCompSeats || 0;
    const availableNotes = x.AvailableCompNotes || '';
    const allocatedSeats = x.CompAllocationSeats || 0;
    const allocatedName = x.CompAllocationTicketHolderName || '';
    const seatNumber = x.CompAllocationSeatsAllocated || '';
    const email = x.CompAllocationTicketHolderEmail || '';
    const notes = x.CompAllocationComments || '';
    const requestedBy = x.CompAllocationRequestedBy || '';
    const arrangedBy = x.CompAllocationArrangedBy || '';
    const venueConfirmation = x.CompAllocationVenueConfirmationNotes || '';

    worksheet.addRow([
      productionCode,
      venueCode,
      venueName,
      showDate,
      showTime,
      availableSeats,
      availableNotes,
      allocatedSeats,
      allocatedName,
      seatNumber,
      email,
      notes,
      requestedBy,
      arrangedBy,
      venueConfirmation,
    ]);
  });

  const numberOfColumns = worksheet.columnCount;

  worksheet.mergeCells('A1:E1');
  worksheet.mergeCells('A2:C2');
  worksheet.mergeCells('B3:C3');
  worksheet.mergeCells('D3:E3');
  worksheet.mergeCells('F3:G3');
  worksheet.mergeCells('H3:I3');

  // for (let char = 'A', i = 0; i < numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
  //   worksheet.getColumn(char).width = 15
  // }
  alignColumnTextRight({ worksheet, colAsChar: 'D' });
  alignColumnTextRight({ worksheet, colAsChar: 'E' });
  alignCellTextCenter({ worksheet, colAsChar: 'F' });
  alignCellTextCenter({ worksheet, colAsChar: 'H' });

  for (let row = 1; row <= 4; row++) {
    makeRowTextBoldAndAllignLeft({ worksheet, row, numberOfColumns, bgColor: COLOR_HEXCODE.DARK_GREEN });
  }
  worksheet.getColumn('A').width = 8;
  addWidthAsPerContent({
    worksheet,
    fromColNumber: 2,
    toColNumber: numberOfColumns,
    startingColAsCharWIthCapsOn: 'B',
    minColWidth: 10,
    bufferWidth: 0,
    rowsToIgnore: 4,
    maxColWidth: 120,
    htmlFields: ['G', 'L'],
  });
  worksheet.getColumn('G').width = 25;
  worksheet.getColumn('L').width = 25;
  worksheet.getColumn('G').alignment = { wrapText: true };

  worksheet.getCell(1, 1).font = { size: 16, color: { argb: COLOR_HEXCODE.WHITE }, bold: true };

  // const filename = `Promoter_Holds_${productionCode || productionId ? '_' + (productionCode || productionId) : ''}${
  //   fromDate && toDate ? '_' + (fromDate + '_' + toDate) : ''
  // }.xlsx`;
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}.xlsx"`);

  workbook.xlsx.write(res).then(() => {
    res.end();
  });
}
