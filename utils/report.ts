import libre from 'libreoffice-convert';
import util from 'util';
import { NextApiResponse } from 'next';
import ExcelJS from 'exceljs';
import { differenceInDays, endOfWeek, parse } from 'date-fns';

export const convertToPDF = async (workbook) => {
  const excelbuffer = await workbook.xlsx.writeBuffer();
  const converter = util.promisify(libre.convert);
  const pdfBuffer = await converter(excelbuffer, '.pdf', undefined);
  return pdfBuffer;
};

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
export const sanitizeRowData = (rowData: any[]) => {
  return rowData.map((value) => {
    if (Number.isNaN(value)) return '';
    if (typeof value === 'number') {
      // Round numbers to 2 decimal places
      return Number(value.toFixed(2));
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
