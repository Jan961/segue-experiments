import getPrismaClient from 'lib/prisma';
import { omit } from 'radash';
import ExcelJS from 'exceljs';
import moment from 'moment';
import { COLOR_HEXCODE } from 'services/salesSummaryService';
import { addWidthAsPerContent } from 'services/reportsService';
import { NextApiRequest, NextApiResponse } from 'next';

import { ALIGNMENT } from './masterplan';
import { marketingCostsStatusToLabelMap } from 'config/Reports';
import { Booking } from 'prisma/generated/prisma-client';
import { convertToPDF } from 'utils/report';

type BOOKING = Partial<Booking> & {
  IsOnSale: boolean;
  OnSaleDate: string | null;
  VenueCode: string;
  VenueName: string;
  VenueTown: string;
  FullProductionCode: string;
  MarketingCostsStatus: string;
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

const applySelectionFilter = (bookings: BOOKING[], selection: string) => {
  switch (selection) {
    case 'all':
      return bookings;
    case 'on_sale':
      return bookings.filter((booking) => booking.TicketsOnSale);
    case 'not_onsale':
      return bookings.filter((booking) => !booking.TicketsOnSale);
    case 'marketing_plans_received':
      return bookings.filter((booking) => booking.MarketingPlanReceived);
    case 'marketing_plans_not_received':
      return bookings.filter((booking) => !booking.MarketingPlanReceived);
    case 'contact_info_received':
      return bookings.filter((booking) => booking.ContactInfoReceived);
    case 'contact_info_not_received':
      return bookings.filter((booking) => !booking.ContactInfoReceived);
    case 'print_requirements_received':
      return bookings.filter((booking) => booking.PrintReqsReceived);
    case 'print_requirements_not_received':
      return bookings.filter((booking) => !booking.PrintReqsReceived);
    case 'marketing_costs_pending':
      return bookings.filter((booking) => booking.MarketingCostsStatus === 'P');
    case 'marketing_costs_approved':
      return bookings.filter((booking) => booking.MarketingCostsStatus === 'A');
    case 'marketing_costs_not_approved':
      return bookings.filter((booking) => booking.MarketingCostsStatus === 'N');
    default:
      return bookings;
  }
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    let { productionId, showId = null, selection, format } = req.body || {};
    if (productionId === -1) {
      productionId = null;
    }
    const prisma = await getPrismaClient(req);

    const data = await prisma.dateBlock.findMany({
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
      orderBy: {
        StartDate: 'desc',
      },
    });
    let filename = `Selected Venues`;
    if (productionId) {
      const selectedProduction = data?.[0]?.Production;
      const showCode = selectedProduction?.Show?.Code || '';
      const showName = selectedProduction?.Show?.Name || '';
      const productionCode = selectedProduction?.Code || '';
      filename = `${showCode}${productionCode} ${showName} ${filename}`;
    }
    let bookings = [];
    for (const dateBlock of data) {
      const showCode = dateBlock.Production?.Show?.Code || '';
      const productionCode = dateBlock.Production?.Code || '';
      const dateBlockBookings = dateBlock?.Booking?.map?.((booking) => {
        const venue = booking.Venue;
        return {
          ...omit(booking, ['Venue']),
          VenueId: venue.Id,
          VenueCode: venue.Code,
          VenueName: venue.Name,
          VenueTown: venue.VenueAddress?.[0]?.Town || '',
          FullProductionCode: `${showCode}${productionCode}`,
        };
      });
      bookings = [...bookings, ...dateBlockBookings];
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('SELECTED VENUES', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
      views: [{ state: 'frozen', ySplit: 5 }],
    });

    worksheet.addRow([`${filename}`]);
    const date = new Date();
    worksheet.addRow([`Exported: ${moment(date).format('DD/MM/YY')} at ${moment(date).format('hh:mm')}`]);
    worksheet.addRow([
      'PRODUCTION',
      'SHOW',
      '',
      '',
      '',
      '',
      'ON SALE',
      'MARKETING',
      'CONTACT',
      'PRINT',
      'MARKETING COSTS',
      'MARKETING COSTS',
      'MARKETING COSTS',
    ]);
    worksheet.addRow([
      'CODE',
      'DATE',
      'CODE',
      'NAME',
      'TOWN',
      'ON SALE',
      'DATE',
      'PLAN',
      'INFO',
      'REQS',
      'STATUS',
      'APPROVAL DATE',
      'NOTES',
    ]);
    worksheet.addRow([]);
    applySelectionFilter(bookings, selection)?.forEach((booking: BOOKING) => {
      const ShowDate = moment(booking.FirstDate).format('DD/MM/YY');
      const VenueCode = booking.VenueCode;
      const ShowTown = booking.VenueTown;
      const VenueName = booking.VenueName;
      const OnSale = getBooleanAsString(booking.TicketsOnSale);
      const OnSaleDate = booking.OnSaleDate ? moment(booking.TicketsOnSaleFromDate).format('DD/MM/YY') : '';
      const MarketingPlan = getBooleanAsString(booking.MarketingPlanReceived);
      const ContactInfo = getBooleanAsString(booking.ContactInfoReceived);
      const PrintReqsReceived = getBooleanAsString(booking.PrintReqsReceived);
      const marketingCostsApprovalDate = booking.MarketingCostsApprovalDate
        ? moment(booking.MarketingCostsApprovalDate).format('DD/MM/YY')
        : '';
      worksheet.addRow([
        booking.FullProductionCode,
        ShowDate,
        VenueCode,
        VenueName,
        ShowTown,
        OnSale,
        OnSaleDate,
        MarketingPlan,
        ContactInfo,
        PrintReqsReceived,
        marketingCostsStatusToLabelMap[booking.MarketingCostsStatus] || '',
        marketingCostsApprovalDate,
        booking.MarketingCostsNotes || '',
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
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);

    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (error) {
    console.log('Error generated report', error);
    res.status(500).end();
  }
}
