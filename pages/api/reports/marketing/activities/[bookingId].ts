import ExcelJS from 'exceljs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getActivitiesByBookingId } from 'services/bookingService';
import { sum } from 'radash';
import { createHeaderRow } from 'services/marketing/reports';
import { addWidthAsPerContent } from 'services/reportsService';
import { COLOR_HEXCODE, applyFormattingToRange } from 'services/salesSummaryService';
import { convertToPDF } from 'utils/report';
import { formatDate } from 'services/dateService';
import { getBooleanAsString } from '../../venues';

/**
 * create excel report for marketing activities
 * @param req
 * @param res
 * @returns
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { bookingId, format } = req.query || {};

  if (req.method !== 'POST') {
    throw new Error('the method is not allowed');
  }

  const { productionName, venueAndDate } = req.body || {};

  if (!bookingId || !productionName || !venueAndDate) {
    throw new Error('Required params are missing');
  }

  // get marketing activities by booking id
  const data = await getActivitiesByBookingId(parseInt(bookingId as string, 10), req);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Marketing Activities');

  // create header row with production name, venue and date
  createHeaderRow(worksheet, productionName, 16, 'G');
  createHeaderRow(worksheet, venueAndDate, 14, 'G');
  createHeaderRow(worksheet, 'Marketing Activities Report', 12, 'G');

  // add column headers
  const headerRow = worksheet.addRow([
    'Activity Name',
    'Type',
    'Date',
    'Follow Up Req.',
    // 'Follow Up Date',
    'Company Cost',
    'Venue Cost',
    'Notes',
  ]);
  // add formatting for column header cells
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

  // create a map of activity types with id as key and name as value
  const activityTypeMap = new Map(data.activityTypes.map((type) => [type.Id, type.Name]));
  let currentRowNum = 4;
  // loop through activities and add them to the worksheet
  data.activities.forEach((activity) => {
    const row = worksheet.addRow([
      activity.Name || '',
      activityTypeMap.get(activity.ActivityTypeId) || '',
      activity.Date ? formatDate(activity.Date, 'dd/MM/yy') : '',
      getBooleanAsString(activity.FollowUpRequired),
      // activity.FollowUpDate ? formatDate(activity.FollowUpDate, 'dd/MM/yy') : '',
      activity.CompanyCost,
      activity.VenueCost,
      activity.Notes,
    ]);
    // add formatting to the cells in the row
    row.eachCell((cell, colNumber) => {
      if (![5, 6].includes(colNumber)) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      }
      if (colNumber === 7) {
        // Notes column
        cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      }
    });
    currentRowNum++;
  });
  worksheet.addRow([]);
  currentRowNum++;
  const totalCompanyCost = sum(data.activities, (activity) => activity.CompanyCost);
  const totalVenueCost = sum(data.activities, (activity) => activity.VenueCost);
  worksheet.addRow(['', '', '', 'Total', totalCompanyCost, totalVenueCost]);
  currentRowNum++;
  worksheet.addRow([]);
  currentRowNum++;
  // add total cost row
  worksheet.addRow(['', '', '', 'Total Cost', totalCompanyCost + totalVenueCost]);
  // apply currency formatting to the total cost cells
  applyFormattingToRange({
    worksheet,
    startRow: 5,
    startColumn: worksheet.getColumn(5).letter,
    endRow: currentRowNum + 1,
    endColumn: worksheet.getColumn(5 + 2).letter,
    formatOptions: { numFmt: '£#,##0.00' },
  });

  const numberOfColumns = worksheet.columnCount;
  // add width to the columns as per content
  addWidthAsPerContent({
    worksheet,
    fromColNumber: 1,
    toColNumber: numberOfColumns,
    startingColAsCharWIthCapsOn: 'A',
    minColWidth: 10,
    bufferWidth: 2,
    rowsToIgnore: 3,
    maxColWidth: Infinity,
  });
  const filename = `marketing_activities`;
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
  res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);

  return workbook.xlsx.write(res).then(() => {
    res.status(200).end();
  });
};

export default handler;
