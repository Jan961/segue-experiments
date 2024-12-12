import { BookingHoldCompsView } from 'prisma/generated/prisma-client';
import ExcelJS from 'exceljs';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { all } from 'radash';
import { getProductionWithContent } from 'services/productionService';
import { addWidthAsPerContent } from 'services/reportsService';
import { COLOR_HEXCODE } from 'services/salesSummaryService';

import { getExportedAtTitle } from 'utils/export';
import { convertToPDF } from 'utils/report';
import { formatDate } from 'services/dateService';

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

/**
 * align column text to right
 * @param worksheet  ExcelJS.Worksheet
 * @param colAsChar  string
 */
const alignColumnTextRight = ({ worksheet, colAsChar }: { worksheet: any; colAsChar: string }) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: 'right' };
  });
};

/**
 * make row text bold
 * @param worksheet  ExcelJS.Worksheet
 * @param row  number
 */
const makeRowTextBold = ({ worksheet, row }: { worksheet: any; row: number }) => {
  worksheet.getRow(row).eachCell((cell) => {
    cell.font = { bold: true };
  });
};

/**
 * make top border double
 * @param worksheet  ExcelJS.Worksheet
 * @param row  number
 * @param col  number
 */
const makeTopBorderDouble = ({ worksheet, row, col }: { worksheet: any; row: number; col: number }) => {
  worksheet.getCell(row, col).border = { top: { style: 'thin', color: { argb: COLOR_HEXCODE.BLACK } } };
};

/**
 * styles header rows in excel report
 * @param worksheet  ExcelJS.Worksheet
 * @param row  number
 * @param numberOfColumns  number
 * @param bgColor  string
 */
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

/**
 * gives key in format of FullProductionCode | VenueCode | VenueName | BookingFirstDate
 * @param FullProductionCode  string
 * @param VenueCode  string
 * @param VenueName  string
 * @param BookingFirstDate  string
 */
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

/**
 * gives key in format of HoldOrComp | Code
 * @param HoldOrComp  string
 * @param Code  string
 */
const getTypeAndCodeKey = ({ HoldOrComp, Code }: { HoldOrComp: string; Code: string }) => `${HoldOrComp} | ${Code}`;

/**
 * Groups and accumulates booking data based on hold/comp type and code
 * @param allBookingCodeAndNameForADate - Array of booking data for a specific date
 * @returns Array of merged booking data with accumulated seats for same type and code
 */
const groupBasedOnTypeAndCode = ({
  allBookingCodeAndNameForADate,
}: {
  allBookingCodeAndNameForADate: TBookingCodeAndName[];
}): TBookingCodeAndName[] => {
  // Create an object to accumulate bookings with the same type and code
  const accumulationBasedOnTypeAndCode: { [key: string]: TBookingCodeAndName } = allBookingCodeAndNameForADate.reduce(
    (acc, x: TBookingCodeAndName) => {
      // Generate a unique key combining hold/comp type and code
      const key = getTypeAndCodeKey({ HoldOrComp: x.HoldOrComp, Code: x.Code });
      // Check if an entry with this key already exists
      const value = acc[key];
      // If entry exists, add the seats to the existing total
      if (value) {
        return {
          ...acc,
          [key]: {
            ...value,
            Seats: value.Seats + x.Seats,
          },
        };
      }
      // If entry doesn't exist, create new entry with initial booking data
      return {
        ...acc,
        [key]: {
          ...x,
        },
      };
    },
    {},
  );
  // Convert the accumulated object back to an array
  return Object.values(accumulationBasedOnTypeAndCode);
};

/**
 * Groups booking holds and comps based on venue and date information
 * @param fetchedValues - Array of BookingHoldCompsView objects to be grouped
 * @returns Object containing grouped booking data with composite keys
 */
const groupBasedOnVenueAndSameDate = ({
  fetchedValues,
}: {
  fetchedValues: BookingHoldCompsView[];
}): TBookingHoldsGroupedByCommonKey =>
  fetchedValues.reduce((acc, obj: BookingHoldCompsView) => {
    // Generate a unique key based on production, venue, and date information
    const key: string = getAggregateKey({
      FullProductionCode: obj.FullProductionCode,
      VenueCode: obj.VenueCode,
      VenueName: obj.VenueName,
      BookingFirstDate: obj.BookingFirstDate.toISOString(),
    });
    // Check if an entry with this key already exists in the accumulator
    const val: TBookingHoldsGrouped = acc[key];
    // If entry exists, append new hold/comp data to existing group
    if (val) {
      return {
        ...acc,
        [key]: {
          ...val,
          data: [
            ...val.data,
            {
              // Add new hold/comp details to existing group
              HoldOrComp: obj.HoldOrComp,
              Code: obj.Code,
              Name: obj.Name,
              Seats: obj.Seats,
            },
          ],
        },
      };
    }

    // If entry doesn't exist, create new group with initial data
    return {
      ...acc,
      [key]: {
        // Venue and production details
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

/**
 * Handles request for holds and comps report
 * @param req  NextApiRequest
 * @param res  NextApiResponse
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { productionId, productionCode = '', fromDate, toDate, venue, status, format, exportedAt } = req.body;

  try {
    const prisma = await getPrismaClient(req);
    const workbook = new ExcelJS.Workbook();

    // where conditions based on params
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

    // prisma query to get holds and comps data for given parameters
    const getHoldsAndCompsQuery = prisma.bookingHoldCompsView.findMany({
      where: {
        ...whereQuery,
      },
      orderBy: {
        BookingFirstDate: 'asc',
      },
    });
    //
    const [data, productionDetails] = await all([getHoldsAndCompsQuery, getProductionWithContent(productionId, req)]);

    const showName = (productionDetails as ProductionDetails)?.Show?.Name || '';
    const filename = `${productionCode} ${showName} Holds and Comps`;
    // add worksheet to workbook with name 'Holds and Comps'
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
    // Iterate through each grouped venue and date entry to create Excel rows
    Object.values(groupBasedOnVenueAndDateForAllTypes).forEach((x: TBookingHoldsGrouped) => {
      currentEntryRowSize = 0;
      worksheet.addRow([]);
      row++;

      // Handle the first row's special formatting
      if (skipFirstRowFormatting) {
        skipFirstRowFormatting = false;
      } else {
        worksheet.mergeCells(`A${row - 1}:J${row - 1}`);
      }

      // Add venue and production details row
      worksheet.addRow([
        x.FullProductionCode,
        x.VenueCode,
        x.VenueName,
        x.BookingFirstDate ? formatDate(x.BookingFirstDate, 'dd/MM/yy') : '',
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

      // Initialize counters for holds and comps
      let totalHoldBooked = '0';
      let totalCompBooked = '0';
      const holdAndCompMap = {
        [HOLD_OR_COMP.HOLD]: [],
        [HOLD_OR_COMP.COMP]: [],
      };

      // Group data by hold/comp type
      x.data.forEach(({ HoldOrComp, Code, Name, Seats }: TBookingCodeAndName) => {
        // Accumulate totals based on type
        totalHoldBooked =
          HoldOrComp === HOLD_OR_COMP.HOLD ? String(parseInt(totalHoldBooked) + parseInt(Seats)) : totalHoldBooked;
        totalCompBooked =
          HoldOrComp === HOLD_OR_COMP.COMP ? String(parseInt(totalCompBooked) + parseInt(Seats)) : totalCompBooked;
        // Prepare row data
        const rowValue = ['', '', '', '', HoldOrComp, Code, Name, parseInt(Seats)];
        holdAndCompMap[HoldOrComp].push(rowValue);
      });

      // Add COMP rows if any exist
      if (holdAndCompMap[HOLD_OR_COMP.COMP].length) {
        // Add individual comp rows
        holdAndCompMap[HOLD_OR_COMP.COMP].forEach((r) => {
          worksheet.addRow(r);
          row++;
          currentEntryRowSize++;
        });

        // Add comp total row with formatting
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
        // Add double borders above totals
        for (let i = 7; i <= 9; i++) {
          makeTopBorderDouble({ worksheet, row, col: i });
        }
        row++;
        currentEntryRowSize++;
      }

      // Add HOLD rows if any exist
      if (holdAndCompMap[HOLD_OR_COMP.HOLD].length) {
        // Add individual hold rows
        holdAndCompMap[HOLD_OR_COMP.HOLD].forEach((r) => {
          worksheet.addRow(r);
          row++;
          currentEntryRowSize++;
        });

        // Add hold total row with formatting
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

        // Add double borders above totals
        for (let i = 7; i <= 9; i++) {
          makeTopBorderDouble({ worksheet, row, col: i });
        }
        row++;
        currentEntryRowSize++;
      }

      // Add summary rows for seat statistics
      // Add Seats Sold row
      worksheet.addRow(['', '', '', '', '', '', 'Seats Sold', '', getZeroOrNegativeValue(x.SoldSeats)]);
      makeRowTextBold({ worksheet, row });
      worksheet.mergeCells(`E${row}:F${row}`);
      worksheet.mergeCells(`G${row}:H${row}`);
      row++;

      // Add Seats Reserved row
      worksheet.addRow(['', '', '', '', '', '', 'Seats Reserved', '', getZeroOrNegativeValue(x.ReservedSeats)]);
      makeRowTextBold({ worksheet, row });
      worksheet.mergeCells(`E${row}:F${row}`);
      worksheet.mergeCells(`G${row}:H${row}`);
      row++;

      // Calculate and add Remaining Seats row
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

      // Merge cells vertically for the venue/production details
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
