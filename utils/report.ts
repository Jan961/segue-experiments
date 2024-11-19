import libre from 'libreoffice-convert';
import util from 'util';
import { NextApiResponse } from 'next';
import ExcelJS from 'exceljs';
import { compareDatesWithoutTime, getDateDaysAway, getKeyV2, getSundayV2, Locale, newDate } from 'services/dateService';

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

export const getWeeksBetweenDates = (
  startDate: string,
  endDate: string,
  startDateLocale?: Locale,
  endDateLocale?: Locale,
) => {
  if (!startDate || !endDate) {
    return [];
  }
  let currentSunday = getSundayV2(startDate, startDateLocale);
  const end = newDate(endDate, endDateLocale);
  const weeks: { sundayDate: string; mondayDate: string }[] = [];

  while (compareDatesWithoutTime(currentSunday, end, '<')) {
    const nextMonday = getDateDaysAway(currentSunday, 1);
    const sundayDate = getKeyV2(currentSunday);
    const mondayDate = getKeyV2(nextMonday);
    weeks.push({ sundayDate, mondayDate });

    currentSunday = getDateDaysAway(currentSunday, 7);
  }

  return weeks;
};
