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

export const calculateRemainingDaysInWeek = (day: string) => {
  // Parse the given day to a date (assumes the current week)
  const currentDate = parse(day, 'eeee', new Date());

  // Get the end of the week (assuming the week ends on Sunday)
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 0 });

  // Calculate the remaining days in the week
  return differenceInDays(endOfCurrentWeek, currentDate);
};
