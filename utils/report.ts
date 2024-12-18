import { NextApiResponse } from 'next';
import libre from 'libreoffice-convert';
import util from 'util';
import ExcelJS from 'exceljs';
import { addDays, differenceInDays, eachWeekOfInterval, endOfWeek, parse } from 'date-fns';
import { formatDate, newDate } from 'services/dateService';
import { UTCDate } from '@date-fns/utc';

/**
 * This function converts the given workbook created using excel js  to a PDF
 * @param workbook
 * @returns pdfBuffer
 */
export const convertToPDF = async (workbook: any) => {
  const excelbuffer = await workbook.xlsx.writeBuffer();
  const converter = util.promisify(libre.convert);
  const pdfBuffer = await converter(excelbuffer, '.pdf', undefined);
  return pdfBuffer;
};

/**
 * This function exports a workbook in either PDF or XLSX format based on the format parameter
 * @param res
 * @param workbook
 * @param title
 * @param format
 */
export const exportWorkbook = async (
  res: NextApiResponse,
  workbook: ExcelJS.Workbook,
  title: string,
  format: 'pdf' | 'xlsx',
) => {
  const filename = `${title}.xlsx`;

  if (format === 'pdf') {
    const pdf = await convertToPDF(workbook);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
    res.end(pdf);
  } else {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    await workbook.xlsx.write(res).then(() => {
      res.end();
    });
  }
};

/**
 * This function sanitises excel row data by handling Nan's, null, undefined as well as rounding numbers to 2 decimal places
 * @param rowData
 * @returns sanitised rowData (string[]|number[])
 */
export const sanitizeRowData = (rowData: any[], options = { fractionalPartLength: 2 }) => {
  return rowData.map((value) => {
    if (Number.isNaN(value)) return '';
    if (typeof value === 'number') {
      // Round numbers to 2 decimal places
      const floatValue = Number(value.toFixed(options.fractionalPartLength));
      return floatValue;
    }
    // Convert null/undefined to empty string
    return value ?? '';
  });
};

/**
 * This function calculates the remaining days in the week given a day
 * @param day
 * @returns remaining days in the week
 */
export const calculateRemainingDaysInWeek = (day: string) => {
  // Parse the given day to a date (assumes the current week)
  const currentDate = parse(day, 'eeee', new Date());

  // Get the end of the week (assuming the week ends on Sunday)
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 0 });

  // Calculate the remaining days in the week
  return differenceInDays(endOfCurrentWeek, currentDate);
};

/**
 * Get all Sundays and Mondays for each week between two dates.
 *
 * @param {string} startDate - The start date in string format (e.g., '2024-01-01').
 * @param {string} endDate - The end date in string format (e.g., '2024-01-31').
 * @returns {Array<{ sunday: string, monday: string }>} - An array of objects containing Sunday and Monday dates for each week.
 */
export const getWeeksBetweenDates = (
  startDate: string,
  endDate: string,
): Array<{ sundayDate: string; mondayDate: string }> => {
  // Parse input dates into Date objects
  const start = newDate(startDate);
  const end = newDate(endDate);

  // Get the start of each week between startDate and endDate
  const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 0 }); // weekStartsOn: 0 (Sunday)

  // Map each week to its Sunday and Monday
  return weeks.map((weekStart) => {
    const sundayDate = weekStart;
    const mondayDate = addDays(weekStart, 1); // Add 1 day to Sunday to get Monday

    return {
      sundayDate: formatDate(new UTCDate(sundayDate), 'yyyy-MM-dd'),
      mondayDate: formatDate(new UTCDate(mondayDate), 'yyyy-MM-dd'),
    };
  });
};
