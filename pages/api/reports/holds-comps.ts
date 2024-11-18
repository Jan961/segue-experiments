import { BookingHoldCompsView } from 'prisma/generated/prisma-client';
import ExcelJS from 'exceljs';
import getPrismaClient from 'lib/prisma';
import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import { all } from 'radash';
import { getProductionWithContent } from 'services/productionService';
import { addWidthAsPerContent } from 'services/reportsService';
import { COLOR_HEXCODE } from 'services/salesSummaryService';

import { getExportedAtTitle } from 'utils/export';
import { convertToPDF } from 'utils/report';

enum HOLD_OR_COMP {
  HOLD = 'Hold',
  COMP = 'Comp',
}

type TBookingCodeAndName = {
  HoldOrComp: string;
  Code: string;
  Name: string;
  Seats: string;
};

type TBookingHoldsGrouped = {
  FullProductionCode: string;
  VenueCode: string;
  VenueName: string;
  VenueSeats: number;
  BookingFirstDate: string;
  SoldSeats: number;
  ReservedSeats: number | null;
  data: TBookingCodeAndName[];
};

type ProductionDetails = {
  Show?: {
    Name?: string;
  };
};

type TBookingHoldsGroupedByCommonKey = {
  [key: string]: TBookingHoldsGrouped;
};

const alignColumnTextRight = ({ worksheet, colAsChar }: { worksheet: any; colAsChar: string }) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: 'right' };
  });
};

const makeRowTextBold = ({ worksheet, row }: { worksheet: any; row: number }) => {
  worksheet.getRow(row).eachCell((cell) => {
    cell.font = { bold: true };
  });
};

const makeTopBorderDouble = ({ worksheet, row, col }: { worksheet: any; row: number; col: number }) => {
  worksheet.getCell(row, col).border = { top: { style: 'thin', color: { argb: COLOR_HEXCODE.BLACK } } };
};

const styleHeader = ({
  worksheet,
  row,
  numberOfColumns,
  bgColor = COLOR_HEXCODE.BLUE,
}: {
  worksheet: any;
  row: number;
  numberOfColumns: number;
  bgColor: COLOR_HEXCODE;
}) => {
  for (let col = 1; col <= numberOfColumns; col++) {
    const cell = worksheet.getCell(row, col);
    cell.font = { bold: true, color: { argb: COLOR_HEXCODE.WHITE } };
    cell.alignment = { horizontal: 'left' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bgColor },
    };
  }
};

const getAggregateKey = ({
  FullProductionCode,
  VenueCode,
  VenueName,
  BookingFirstDate,
}: {
  FullProductionCode: string;
  VenueCode: string;
  VenueName: string;
  BookingFirstDate: string;
}) => `${FullProductionCode} | ${VenueCode} | ${VenueName} | ${BookingFirstDate}`;

const getTypeAndCodeKey = ({ HoldOrComp, Code }: { HoldOrComp: string; Code: string }) => `${HoldOrComp} | ${Code}`;

const groupBasedOnTypeAndCode = ({
  allBookingCodeAndNameForADate,
}: {
  allBookingCodeAndNameForADate: TBookingCodeAndName[];
}): TBookingCodeAndName[] => {
  const accumulationBasedOnTypeAndCode: { [key: string]: TBookingCodeAndName } = allBookingCodeAndNameForADate.reduce(
    (acc, x: TBookingCodeAndName) => {
      const key = getTypeAndCodeKey({ HoldOrComp: x.HoldOrComp, Code: x.Code });
      const value = acc[key];
      if (value) {
        return {
          ...acc,
          [key]: {
            ...value,
            Seats: value.Seats + x.Seats,
          },
        };
      }
      return {
        ...acc,
        [key]: {
          ...x,
        },
      };
    },
    {},
  );
  return Object.values(accumulationBasedOnTypeAndCode);
};

const groupBasedOnVenueAndSameDate = ({
  fetchedValues,
}: {
  fetchedValues: BookingHoldCompsView[];
}): TBookingHoldsGroupedByCommonKey =>
  fetchedValues.reduce((acc, obj: BookingHoldCompsView) => {
    const key: string = getAggregateKey({
      FullProductionCode: obj.FullProductionCode,
      VenueCode: obj.VenueCode,
      VenueName: obj.VenueName,
      BookingFirstDate: obj.BookingFirstDate.toISOString(),
    });
    const val: TBookingHoldsGrouped = acc[key];
    if (val) {
      return {
        ...acc,
        [key]: {
          ...val,
          data: [
            ...val.data,
            {
              HoldOrComp: obj.HoldOrComp,
              Code: obj.Code,
              Name: obj.Name,
              Seats: obj.Seats,
            },
          ],
        },
      };
    }
    return {
      ...acc,
      [key]: {
        FullProductionCode: obj.FullProductionCode,
        VenueCode: obj.VenueCode,
        VenueName: obj.VenueName,
        VenueSeats: obj.VenueSeats,
        BookingFirstDate: obj.BookingFirstDate,
        SoldSeats: obj.SoldSeats,
        ReservedSeats: obj.ReservedSeats,
        data: [
          {
            HoldOrComp: obj.HoldOrComp,
            Code: obj.Code,
            Name: obj.Name,
            Seats: obj.Seats,
          },
        ],
      },
    };
  }, {});

const getZeroOrNegativeValue = (val: number | null): string => (val ? `-${val}` : '0');

const makeCellTextBold = ({ worksheet, row, col }: { worksheet: any; row: number; col: number }) => {
  worksheet.getCell(row, col).font = { bold: true };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { productionId, productionCode = '', fromDate, toDate, venue, status, format, exportedAt } = req.body;

  try {
    const prisma = await getPrismaClient(req);
    const workbook = new ExcelJS.Workbook();
    const whereQuery: {
      FullProductionCode?: string;
      VenueCode?: string;
      BookingFirstDate?: { gte: Date; lte: Date };
      BookingStatusCode?: string;
    } = {};
    if (productionCode) {
      whereQuery.FullProductionCode = productionCode;
    }
    if (venue) {
      whereQuery.VenueCode = venue;
    }
    if (fromDate && toDate) {
      whereQuery.BookingFirstDate = { gte: new Date(fromDate), lte: new Date(toDate) };
    }
    if (status) {
      whereQuery.BookingStatusCode = status;
    }
    const getHoldsAndCompsQuery = prisma.bookingHoldCompsView.findMany({
      where: {
        ...whereQuery,
      },
      orderBy: {
        BookingFirstDate: 'asc',
      },
    });
    const [data, productionDetails] = await all([getHoldsAndCompsQuery, getProductionWithContent(productionId, req)]);

    const showName = (productionDetails as ProductionDetails)?.Show?.Name || '';
    const filename = `${productionCode} ${showName} Holds and Comps`;
    const worksheet = workbook.addWorksheet('Holds and Comps', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    });

    worksheet.addRow(['BOOKING HOLDS/COMPS REPORT']);
    const exportedAtTitle = getExportedAtTitle(exportedAt);
    worksheet.addRow([exportedAtTitle]);
    worksheet.addRow(['PRODUCTION', 'VENUE', '', 'SHOW']);
    worksheet.addRow(['CODE', 'CODE', 'NAME', 'DATE', 'TYPE', 'CODE', 'NAME', 'SEATS', 'TOTAL', 'REMAINING']);

    const numberOfColumns = worksheet.columnCount;

    const groupBasedOnVenueAndDate: TBookingHoldsGroupedByCommonKey = groupBasedOnVenueAndSameDate({
      fetchedValues: data as BookingHoldCompsView[],
    });
    const groupBasedOnVenueAndDateForAllTypes: TBookingHoldsGrouped[] = Object.values(groupBasedOnVenueAndDate).map(
      (x: TBookingHoldsGrouped) => ({ ...x, data: groupBasedOnTypeAndCode({ allBookingCodeAndNameForADate: x.data }) }),
    );

    let row = 5;
    let currentEntryRowSize = 0;
    let skipFirstRowFormatting = true;
    Object.values(groupBasedOnVenueAndDateForAllTypes).forEach((x: TBookingHoldsGrouped) => {
      currentEntryRowSize = 0;
      worksheet.addRow([]);
      row++;
      if (skipFirstRowFormatting) {
        skipFirstRowFormatting = false;
      } else {
        worksheet.mergeCells(`A${row - 1}:J${row - 1}`);
      }
      worksheet.addRow([
        x.FullProductionCode,
        x.VenueCode,
        x.VenueName,
        x.BookingFirstDate ? moment(x.BookingFirstDate).format('DD/MM/YY') : '',
        '',
        '',
        'Capacity',
        '',
        x.VenueSeats,
      ]);
      worksheet.mergeCells(`E${row}:F${row}`);
      worksheet.mergeCells(`G${row}:H${row}`);
      makeCellTextBold({ worksheet, row, col: 7 });
      makeCellTextBold({ worksheet, row, col: 9 });
      row++;

      let totalHoldBooked = '0';
      let totalCompBooked = '0';
      const holdAndCompMap = {
        [HOLD_OR_COMP.HOLD]: [],
        [HOLD_OR_COMP.COMP]: [],
      };
      x.data.forEach(({ HoldOrComp, Code, Name, Seats }: TBookingCodeAndName) => {
        totalHoldBooked =
          HoldOrComp === HOLD_OR_COMP.HOLD ? String(parseInt(totalHoldBooked) + parseInt(Seats)) : totalHoldBooked;
        totalCompBooked =
          HoldOrComp === HOLD_OR_COMP.COMP ? String(parseInt(totalCompBooked) + parseInt(Seats)) : totalCompBooked;
        const rowValue = ['', '', '', '', HoldOrComp, Code, Name, parseInt(Seats)];
        holdAndCompMap[HoldOrComp].push(rowValue);
      });

      if (holdAndCompMap[HOLD_OR_COMP.COMP].length) {
        holdAndCompMap[HOLD_OR_COMP.COMP].forEach((r) => {
          worksheet.addRow(r);
          row++;
          currentEntryRowSize++;
        });
        worksheet.addRow([
          '',
          '',
          '',
          '',
          '',
          '',
          'Total Comps',
          '',
          getZeroOrNegativeValue(parseInt(totalCompBooked)),
        ]);
        makeRowTextBold({ worksheet, row });
        worksheet.mergeCells(`E${row}:F${row}`);
        worksheet.mergeCells(`G${row}:H${row}`);
        for (let i = 7; i <= 9; i++) {
          makeTopBorderDouble({ worksheet, row, col: i });
        }
        row++;
        currentEntryRowSize++;
      }
      if (holdAndCompMap[HOLD_OR_COMP.HOLD].length) {
        holdAndCompMap[HOLD_OR_COMP.HOLD].forEach((r) => {
          worksheet.addRow(r);
          row++;
          currentEntryRowSize++;
        });
        worksheet.addRow([
          '',
          '',
          '',
          '',
          '',
          '',
          'Total Holds',
          '',
          getZeroOrNegativeValue(parseInt(totalHoldBooked)),
        ]);
        makeRowTextBold({ worksheet, row });
        worksheet.mergeCells(`E${row}:F${row}`);
        worksheet.mergeCells(`G${row}:H${row}`);
        for (let i = 7; i <= 9; i++) {
          makeTopBorderDouble({ worksheet, row, col: i });
        }
        row++;
        currentEntryRowSize++;
      }

      worksheet.addRow(['', '', '', '', '', '', 'Seats Sold', '', getZeroOrNegativeValue(x.SoldSeats)]);
      makeRowTextBold({ worksheet, row });
      worksheet.mergeCells(`E${row}:F${row}`);
      worksheet.mergeCells(`G${row}:H${row}`);
      row++;
      worksheet.addRow(['', '', '', '', '', '', 'Seats Reserved', '', getZeroOrNegativeValue(x.ReservedSeats)]);
      makeRowTextBold({ worksheet, row });
      worksheet.mergeCells(`E${row}:F${row}`);
      worksheet.mergeCells(`G${row}:H${row}`);
      row++;
      worksheet.addRow([
        '',
        '',
        '',
        '',
        '',
        '',
        'Remaining Seats',
        '',
        '',
        parseInt(x.VenueSeats as any as string) -
          (parseInt(totalHoldBooked) +
            parseInt(totalCompBooked) +
            (parseInt(x.SoldSeats as any as string) || 0) +
            (parseInt(x.ReservedSeats as any as string) || 0)),
      ]);
      for (let i = 7; i <= 10; i++) {
        makeTopBorderDouble({ worksheet, row, col: i });
      }
      makeRowTextBold({ worksheet, row });
      worksheet.mergeCells(`E${row}:F${row}`);
      worksheet.mergeCells(`G${row}:I${row}`);
      row++;

      currentEntryRowSize += 3;

      worksheet.mergeCells(`A${row - currentEntryRowSize - 1}:A${row - 1}`);
      worksheet.mergeCells(`B${row - currentEntryRowSize - 1}:B${row - 1}`);
      worksheet.mergeCells(`C${row - currentEntryRowSize - 1}:C${row - 1}`);
      worksheet.mergeCells(`D${row - currentEntryRowSize - 1}:D${row - 1}`);
    });

    worksheet.mergeCells('A1:C1');
    worksheet.mergeCells('A2:C2');
    worksheet.mergeCells('B3:C3');

    for (let char = 'A', i = 0; i < numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
      worksheet.getColumn(char).width = 15;
    }
    alignColumnTextRight({ worksheet, colAsChar: 'D' });
    alignColumnTextRight({ worksheet, colAsChar: 'H' });
    alignColumnTextRight({ worksheet, colAsChar: 'I' });
    alignColumnTextRight({ worksheet, colAsChar: 'J' });

    for (let char = 'A', i = 0; i < numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
      worksheet.getColumn(char).width = 15;
    }

    worksheet.getColumn('A').alignment = { vertical: 'top', horizontal: 'left' };
    worksheet.getColumn('B').alignment = { vertical: 'top', horizontal: 'left' };
    worksheet.getColumn('C').alignment = { vertical: 'top', horizontal: 'left' };
    worksheet.getColumn('D').alignment = { vertical: 'top', horizontal: 'right' };
    worksheet.getColumn('G').alignment = { vertical: 'top', horizontal: 'left' };

    for (let row = 1; row <= 4; row++) {
      styleHeader({ worksheet, row, numberOfColumns, bgColor: COLOR_HEXCODE.DARK_GREEN });
    }

    worksheet.getCell(1, 1).font = { size: 16, color: { argb: COLOR_HEXCODE.WHITE }, bold: true };
    worksheet.getColumn('A').width = 8;
    addWidthAsPerContent({
      worksheet,
      fromColNumber: 2,
      toColNumber: numberOfColumns,
      startingColAsCharWIthCapsOn: 'B',
      minColWidth: 10,
      bufferWidth: 0,
      rowsToIgnore: 4,
      maxColWidth: Infinity,
    });
    if (format === 'pdf') {
      worksheet.pageSetup.printArea = `A1:${worksheet.getColumn(11).letter}${row}`;
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
    console.log(error);
  }
};

export default handler;
