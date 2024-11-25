import { UTCDate } from '@date-fns/utc';
import ExcelJS from 'exceljs';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { all } from 'radash';
import { dateTimeToTime, formatDate, newDate } from 'services/dateService';
import { getProductionWithContent } from 'services/productionService';
import { addWidthAsPerContent } from 'services/reportsService';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { getExportedAtTitle } from 'utils/export';
import { convertToPDF } from 'utils/report';

interface ICellAlignment {
  horizontal?: string;
  vertical?: string;
}

const defaultAlignment: ICellAlignment = {
  horizontal: 'left',
  vertical: 'top',
};

const alignColumnCells = ({
  worksheet,
  colAsChar,
  alignment = defaultAlignment,
}: {
  worksheet: any;
  colAsChar: string;
  alignment: ICellAlignment;
}) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = alignment;
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
    cell.alignment = { horizontal: 'left', vertical: 'top' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bgColor },
    };
  }
};

type ProductionDetails = {
  Show?: {
    Name?: string;
  };
};

// TODO - Issue with Performance Time
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const prisma = await getPrismaClient(req);
    const { productionCode = '', fromDate, toDate, venue, productionId, format, exportedAt } = req.body || {};

    const workbook = new ExcelJS.Workbook();
    const whereQuery: { ProductionId?: string; VenueCode?: string; PerformanceDate?: { gte: UTCDate; lte: UTCDate } } =
      {};
    if (productionId) {
      whereQuery.ProductionId = productionId;
    }
    if (venue) {
      whereQuery.VenueCode = venue;
    }
    if (fromDate && toDate) {
      whereQuery.PerformanceDate = {
        gte: newDate(fromDate),
        lte: newDate(toDate),
      };
    }
    const getPromoterHolds = prisma.promoterHoldsView
      .findMany({
        where: {
          ...whereQuery,
          ProductionId: Number(productionId),
        },
        orderBy: {
          PerformanceDate: 'asc',
        },
      })
      .then((res) =>
        res.map((x) => ({
          ...x,
          PerformanceDate: new UTCDate(x.PerformanceDate),
          PerformanceTime: new UTCDate(x.PerformanceTime),
        })),
      );
    const [data, productionDetails] = await all([getPromoterHolds, getProductionWithContent(productionId, req)]);
    const showName = (productionDetails as ProductionDetails)?.Show?.Name || '';
    const filename = `${productionCode} ${showName} Promoter Holds`;
    const worksheet = workbook.addWorksheet('Promoter Holds', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
      views: [{ state: 'frozen', xSplit: 5, ySplit: 4 }],
    });

    worksheet.addRow(['PROMOTER HOLDS']);
    const exportedAtTitle = getExportedAtTitle(exportedAt);
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

    (data as any[]).forEach((x) => {
      const productionCode = x.FullProductionCode || '';
      const venueCode = x.VenueCode || '';
      const venueName = x.VenueName || '';
      const showDate = x.PerformanceDate ? formatDate(x.PerformanceDate, 'dd/MM/yy') : '';
      const showTime = x.PerformanceTime ? dateTimeToTime(x.PerformanceTime) : '';
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

    for (let char = 'A', i = 0; i < numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
      alignColumnCells({ worksheet, colAsChar: char, alignment: { horizontal: 'left', vertical: 'top' } });
    }
    alignColumnCells({ worksheet, colAsChar: 'D', alignment: { horizontal: 'right', vertical: 'top' } });
    alignColumnCells({ worksheet, colAsChar: 'E', alignment: { horizontal: 'right', vertical: 'top' } });
    alignColumnCells({ worksheet, colAsChar: 'F', alignment: { horizontal: 'center', vertical: 'top' } });
    alignColumnCells({ worksheet, colAsChar: 'H', alignment: { horizontal: 'center', vertical: 'top' } });

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
      return;
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);

    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
}
