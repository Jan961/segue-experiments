import ExcelJS from 'exceljs';
import moment from 'moment';
import { getActivitiesByBookingId } from 'pages/api/marketing/activities/[BookingId]';

interface ActivityType {
  Name: string;
  Id: number;
}

interface Activity {
  Id: number;
  BookingId: number;
  Date: string;
  Name: string | null;
  ActivityTypeId: number;
  CompanyCost: string;
  VenueCost: string;
  FollowUpRequired: boolean;
  DueByDate: string;
  Notes: string;
}

interface ResponseData {
  activityTypes: ActivityType[];
  activities: Activity[];
  info: {
    TicketsOnSale: boolean;
    TicketsOnSaleFromDate: string | null;
    MarketingPlanReceived: boolean;
    ContactInfoReceived: boolean;
    PrintReqsReceived: boolean;
    OnSaleDate: string;
  };
}

const handler = async (req, res) => {
  const { bookingId } = req.query || {};

  if (req.method !== 'POST') {
    throw new Error('the method is not allowed');
  }

  const { productionName, venueAndDate } = req.body || {};

  if (!bookingId || !productionName || !venueAndDate) {
    throw new Error('Required params are missing');
  }

  const data: ResponseData = await getActivitiesByBookingId(parseInt(bookingId));

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Marketing Activities');

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
      right: { style: 'thin', color: { argb: 'FFFFFF' } },
    };
    worksheet.mergeCells(`A${row.number}:F${row.number}`);
  };

  createHeaderRow(productionName, 16);
  createHeaderRow(venueAndDate, 16);
  createHeaderRow('Marketing Activities Report', 14);

  const headerRow = worksheet.addRow(['Activity Name', 'Type', 'Date', 'Company Cost', 'Venue Cost', 'Notes']);
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

  const activityTypeMap = new Map(data.activityTypes.map((type) => [type.Id, type.Name]));

  data.activities.forEach((activity) => {
    const row = worksheet.addRow([
      activity.Name || '',
      activityTypeMap.get(activity.ActivityTypeId) || '',
      moment(activity.Date).format('DD/MM/YYYY'),
      activity.CompanyCost,
      activity.VenueCost,
      activity.Notes,
    ]);
    row.eachCell((cell, colNumber) => {
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (colNumber === 6) {
        // Notes column
        cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      }
    });
    row.height = 70;
  });

  const widths = [30, 20, 15, 15, 15, 50];
  widths.forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=marketing_activities.xlsx');

  return workbook.xlsx.write(res).then(() => {
    res.status(200).end();
  });
};

export default handler;
