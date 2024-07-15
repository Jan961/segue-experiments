import prisma from 'lib/prisma';
import { pick, omit } from 'radash';
import ExcelJS from 'exceljs';
import moment from 'moment';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { addWidthAsPerContent } from 'services/reportsService';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { ALIGNMENT } from './masterplan';

type BOOKING = {
  Id: number;
  DateBlockId: number;
  VenueId: number;
  FirstDate: string;
  StatusCode: string;
  PencilNum: null;
  LandingPageURL: string;
  TicketsOnSaleFromDate: string;
  TicketsOnSale: boolean;
  IsOnSale: boolean;
  OnSaleDate: string | null;
  MarketingPlanReceived: boolean;
  ContactInfoReceived: boolean;
  PrintReqsReceived: boolean;
  VenueCode: string;
  VenueName: string;
  VenueTown: string;
};

type PRODUCTION = {
  Id: number;
  Code: string;
  ShowId: number;
  ShowCode: string;
  ShowName: string;
};

type PRODUCTION_DATA = {
  production: PRODUCTION;
  bookings: BOOKING[];
};

const alignColumn = ({ worksheet, colAsChar, align }: { worksheet: any; colAsChar: string; align: ALIGNMENT }) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: align };
  });
};

const alignCellText = ({
  worksheet,
  row,
  col,
  align,
}: {
  worksheet: any;
  row: number;
  col: number;
  align: ALIGNMENT;
}) => {
  worksheet.getCell(row, col).alignment = { horizontal: align };
};

const styleHeader = ({ worksheet, row, numberOfColumns }: { worksheet: any; row: number; numberOfColumns: number }) => {
  for (let col = 1; col <= numberOfColumns; col++) {
    const cell = worksheet.getCell(row, col);
    cell.font = { color: { argb: COLOR_HEXCODE.WHITE }, bold: true };
    cell.alignment = { horizontal: 'left' };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLOR_HEXCODE.DARK_GREEN },
    };
  }
};

const getBooleanAsString = (val: boolean | null): string => {
  if (val) return 'YES';
  if (val === false) return 'NO';
  return '';
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { productionId, showId, productionCode } = req.body || {};

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { ProductionId: productionId });
    if (!access) return res.status(401).end();

    const data = await prisma.DateBlock.findFirst({
      where: {
        ...(productionId && { ProductionId: productionId }),
        Name: 'Production',
        ...(showId && {
          Production: {
            is: {
              ShowId: showId,
            },
          },
        }),
      },
      include: {
        Booking: {
          include: {
            Venue: {
              include: {
                VenueAddress: true,
              },
            },
          },
          orderBy: {
            FirstDate: 'asc',
          },
        },
        Production: {
          include: {
            Show: true,
          },
        },
      },
    });
    const production = {
      ...pick(data.Production, ['Id', 'Code']),
      ShowId: data.Production.Show.Id,
      ShowCode: data.Production.Show.Code,
      ShowName: data.Production.Show.Name,
    };
    const { ShowName, Code: ProductionCode = productionCode, ShowCode } = production;
    const filename = `${ShowCode}${ProductionCode} ${ShowName} Selected Venues`;
    const bookings = data.Booking.map((booking) => {
      const venue = booking.Venue;
      return {
        ...omit(booking, ['Venue']),
        VenueId: venue.Id,
        VenueCode: venue.Code,
        VenueName: venue.Name,
        VenueTown: venue.VenueAddress?.[0]?.Town || '',
      };
    });

    const workbook = new ExcelJS.Workbook();
    const response: PRODUCTION_DATA = { production, bookings };
    const worksheet = workbook.addWorksheet('SELECTED VENUES', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
      views: [{ state: 'frozen', ySplit: 5 }],
    });

    worksheet.addRow([`${filename}`]);
    const date = new Date();
    worksheet.addRow([`Exported: ${moment(date).format('DD/MM/YY')} at ${moment(date).format('hh:mm')}`]);
    worksheet.addRow(['PRODUCTION', 'SHOW', '', '', '', '', 'ON SALE', 'MARKETING', 'CONTACT', 'PRINT']);
    worksheet.addRow(['CODE', 'DATE', 'CODE', 'NAME', 'TOWN', 'ON SALE', 'DATE', 'PLAN', 'INFO', 'REQS']);
    worksheet.addRow([]);

    response?.bookings.forEach((booking: BOOKING) => {
      const ShowDate = moment(booking.FirstDate).format('DD/MM/YY');
      const VenueCode = booking.VenueCode;
      const ShowTown = booking.VenueTown;
      const VenueName = booking.VenueName;
      const OnSale = getBooleanAsString(booking.TicketsOnSale);
      const OnSaleDate = booking.OnSaleDate ? moment(booking.TicketsOnSaleFromDate).format('DD/MM/YY') : '';
      const MarketingPlan = getBooleanAsString(booking.MarketingPlanReceived);
      const ContactInfo = getBooleanAsString(booking.ContactInfoReceived);
      const PrintReqsReceived = getBooleanAsString(booking.PrintReqsReceived);

      worksheet.addRow([
        ShowCode + ProductionCode,
        ShowDate,
        VenueCode,
        VenueName,
        ShowTown,
        OnSale,
        OnSaleDate,
        MarketingPlan,
        ContactInfo,
        PrintReqsReceived,
      ]);
    });

    const numberOfColumns = worksheet.columnCount;

    worksheet.mergeCells('A2:D2');

    for (let char = 'A', i = 0; i < numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
      worksheet.getColumn(char).width = 10;
    }

    alignColumn({ worksheet, colAsChar: 'B', align: ALIGNMENT.RIGHT });

    const lastColumn = String.fromCharCode('A'.charCodeAt(0) + numberOfColumns - 1);
    worksheet.mergeCells(`A1:${lastColumn}1`);

    for (let row = 1; row <= 4; row++) {
      styleHeader({ worksheet, row, numberOfColumns });
    }

    alignColumn({ worksheet, colAsChar: 'F', align: ALIGNMENT.CENTER });
    alignColumn({ worksheet, colAsChar: 'G', align: ALIGNMENT.CENTER });
    alignColumn({ worksheet, colAsChar: 'H', align: ALIGNMENT.CENTER });
    alignColumn({ worksheet, colAsChar: 'I', align: ALIGNMENT.CENTER });
    alignColumn({ worksheet, colAsChar: 'J', align: ALIGNMENT.CENTER });

    alignCellText({ worksheet, row: 4, col: 5, align: ALIGNMENT.CENTER });

    worksheet.getColumn('A').width = 8;
    worksheet.getColumn('B').width = 10;
    addWidthAsPerContent({
      worksheet,
      fromColNumber: 3,
      toColNumber: numberOfColumns,
      startingColAsCharWIthCapsOn: 'C',
      minColWidth: 10,
      bufferWidth: 0,
      rowsToIgnore: 2,
    });

    worksheet.getCell(1, 1).font = { size: 16, color: { argb: COLOR_HEXCODE.WHITE }, bold: true };
    alignCellText({ worksheet, row: 1, col: 1, align: ALIGNMENT.LEFT });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);

    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    res.status(500).end();
  }
}
