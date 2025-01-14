import ExcelJS from 'exceljs';
import getPrismaClient from 'lib/prisma';
import Decimal from 'decimal.js';
import { COLOR_HEXCODE, colorCell, colorTextAndBGCell, fillRowBGColorAndTextColor } from 'services/salesSummaryService';
import { formatDateWithTimezoneOffset } from 'services/dateService';
import { convertToPDF } from 'utils/report';
import { format, add, differenceInDays } from 'date-fns';

type SCHEDULE_VIEW = {
  ProductionId: number;
  FullProductionCode: string;
  ShowName: string;
  ProductionStartDate: string;
  ProductionEndDate: string;
  EntryDate: string;
  ProductionWeekNum: number;
  EntryName: string;
  Location: string;
  PencilNum: number | null;
  VenueSeats: number | null;
  Mileage: number | null;
  TimeMins: number | null;
  RehearsalStartDate: string;
};

type UniqueHeadersObject = {
  FullProductionCode: string;
  ShowName: string;
};

export enum ALIGNMENT {
  MIDDLE = 'middle',
  TOP = 'top',
  BOTTOM = 'bottom',
  CENTER = 'center',
  RIGHT = 'right',
  LEFT = 'left',
}

const alignColumn = ({ worksheet, colAsChar, align }: { worksheet: any; colAsChar: string; align: ALIGNMENT }) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: align, wrapText: true };
  });
};

export const styleHeader = ({
  worksheet,
  row,
  numberOfColumns,
  bgColor = COLOR_HEXCODE.DARK_ORANGE,
}: {
  worksheet: any;
  row: number;
  numberOfColumns?: number;
  bgColor?: COLOR_HEXCODE;
}) => {
  const totalColumns = numberOfColumns ?? worksheet.columnCount;
  for (let col = 1; col <= totalColumns; col++) {
    const cell = worksheet.getCell(row, col);
    cell.font = { bold: true, color: { argb: COLOR_HEXCODE.WHITE } };
    cell.alignment = { horizontal: ALIGNMENT.CENTER };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: bgColor },
    };
  }
};

export const alignCellText = ({
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

const getKey = ({ FullProductionCode, ShowName, EntryDate }) => `${FullProductionCode} - ${ShowName} - ${EntryDate}`;

const getShowAndProductionKey = ({ FullProductionCode, ShowName }) => `${FullProductionCode} - ${ShowName}`;

type ReqBody = {
  fromDate: string;
  toDate: string;
  timezoneOffset: number;
  fileFormat?: string;
};

const handler = async (req, res) => {
  const { fromDate, toDate, timezoneOffset, fileFormat }: ReqBody = req.body || {};
  try {
    const prisma = await getPrismaClient(req);
    const formatedFromDateString = formatDateWithTimezoneOffset({
      date: fromDate,
      timezoneOffset,
      dateFormat: 'YYYY-MM-DD',
    });
    const formatedToDateString = formatDateWithTimezoneOffset({
      date: toDate,
      timezoneOffset,
      dateFormat: 'YYYY-MM-DD',
    });

    // Convert the formatted date strings back to Date objects
    const formatedFromDate = new Date(formatedFromDateString);
    const formatedToDate = new Date(formatedToDateString);

    if (!fromDate || !toDate || isNaN(formatedFromDate.getTime()) || isNaN(formatedToDate.getTime())) {
      throw new Error('Params are missing or invalid dates provided');
    }

    // Construct the Prisma query
    const data = await prisma.scheduleView.findMany({
      where: {
        EntryDate: {
          gte: formatedFromDate,
          lte: formatedToDate,
        },
      },
      orderBy: {
        EntryDate: 'asc',
      },
    });

    const workbook = new ExcelJS.Workbook();
    const formattedData = data.map((x) => ({
      ...x,
      EntryDate: format(x.EntryDate, 'YYYY-MM-DD'),
      ProductionStartDate: format(x.ProductionStartDate, 'YYYY-MM-DD'),
      ProductionEndDate: format(x.ProductionEndDate, 'YYYY-MM-DD'),
    }));

    const showNameAndProductionCode: { [key: string]: string[] } = formattedData.reduce((acc, x) => {
      const value = acc[x.ShowName];
      if (value && value?.length) {
        if (!value.includes(x.FullProductionCode)) {
          return {
            ...acc,
            [x.ShowName]: [...value, x.FullProductionCode],
          };
        }
        return acc;
      }
      return {
        ...acc,
        [x.ShowName]: [x.FullProductionCode],
      };
    }, {});

    const distinctShowNames: UniqueHeadersObject[] = Object.keys(showNameAndProductionCode)
      .map((key) => {
        return showNameAndProductionCode[key].map((code) => ({ ShowName: key, FullProductionCode: code }));
      })
      .reduce((acc, arr) => [...acc, ...arr], []);

    const worksheet = workbook.addWorksheet('Masterplan', {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
      views: [{ state: 'frozen', xSplit: 2, ySplit: 6 }],
    });
    const title = `All Productions Masterplan ${format(new Date(formatedFromDateString), 'DD-MM-YY')} to ${format(
      new Date(formatedToDateString),
      'DD-MM-YY',
    )}`;
    worksheet.addRow([title]);
    const date = new Date();
    worksheet.addRow([
      `Exported: ${formatDateWithTimezoneOffset({
        date,
        dateFormat: 'DD/MM/YY',
        timezoneOffset,
      })} at ${formatDateWithTimezoneOffset({ date, dateFormat: 'HH:mm', timezoneOffset })}`,
    ]);
    worksheet.addRow([]);
    worksheet.addRow(['', '', ...distinctShowNames.map((x) => x.ShowName)]);
    worksheet.addRow(['DAY', 'DATE', ...distinctShowNames.map((x) => x.FullProductionCode)]);
    worksheet.addRow([]);

    const map: { [key: string]: SCHEDULE_VIEW } = formattedData.reduce((acc, x) => ({ ...acc, [getKey(x)]: x }), {});
    const showNameAndProductionMap: { [key: string]: SCHEDULE_VIEW } = formattedData.reduce(
      (acc, x) => ({ ...acc, [getShowAndProductionKey(x)]: x }),
      {},
    );

    const headerWeeks =
      distinctShowNames.reduce((acc, { ShowName, FullProductionCode }) => {
        const key = getShowAndProductionKey({ FullProductionCode, ShowName });
        const value = showNameAndProductionMap[key];
        if (!value) {
          throw new Error('Missing Data');
        }

        const daysDiff = differenceInDays(new Date(fromDate), new Date(value.ProductionStartDate));
        let week;
        if (daysDiff >= 0 && daysDiff <= 6) {
          week = 1;
        } else if (daysDiff >= 7) {
          week = Number(new Decimal(daysDiff).div(7).toFixed(0)) + 1;
        } else {
          week = Number(new Decimal(daysDiff).div(7).toFixed(0)) - 1;
        }
        return {
          ...acc,
          [getShowAndProductionKey({ FullProductionCode, ShowName })]: week,
        };
      }, {}) || {};

    const weeks = distinctShowNames.reduce((acc, { FullProductionCode, ShowName }) => {
      const key = getShowAndProductionKey({ FullProductionCode, ShowName });
      const value = headerWeeks[key];

      if (!value) {
        throw new Error(' Something went wrong');
      }
      if (value === -1) {
        headerWeeks[key] = 1;
      } else {
        headerWeeks[key]++;
      }

      return [...acc, `Week ${value}`];
    }, []);
    worksheet.addRow(['Week No', '', ...weeks]);
    fillRowBGColorAndTextColor({
      worksheet,
      row: 7,
      textColor: COLOR_HEXCODE.YELLOW,
      cellColor: COLOR_HEXCODE.DARK_BLUE,
      isBold: true,
    });

    const daysDiff = differenceInDays(new Date(toDate), new Date(fromDate));

    const minRehearsalStartTimeInEpoch = data.reduce((acc, x) => {
      if (x.RehearsalStartDate && new Date(x.RehearsalStartDate).getTime() < acc) {
        acc = new Date(x.RehearsalStartDate).getTime();
      }
      return acc;
    }, Infinity);

    let rowNo = 6;
    for (let i = 1; i <= daysDiff; i++) {
      const weekDay = format(add(new Date(fromDate), { days: i - 1 }), 'dddd');
      const dateInIncomingFormat = format(add(new Date(fromDate), { days: i - 1 }), 'yyyy-mm-dd');
      const date = formatDateWithTimezoneOffset({ date: dateInIncomingFormat, timezoneOffset });

      const values: string[] = distinctShowNames.map(({ FullProductionCode, ShowName }) => {
        const key = getKey({ FullProductionCode, ShowName, EntryDate: dateInIncomingFormat });
        const value = map[key];
        if (value) {
          return value.EntryName;
        }
        return '';
      });

      worksheet.addRow([weekDay, date, ...values]);
      rowNo++;

      if (weekDay === 'Monday' && new Date(dateInIncomingFormat).getTime() >= minRehearsalStartTimeInEpoch) {
        colorCell({ worksheet, row: rowNo + 1, col: 1, argbColor: COLOR_HEXCODE.CREAM });
        colorCell({ worksheet, row: rowNo + 1, col: 2, argbColor: COLOR_HEXCODE.CREAM });
      }

      const targetCellIdx: number[] = values
        .map((value, idx) => {
          if (['Rehearsal Day', 'Day Off', 'Travel Day'].includes(value)) {
            return idx + 1 + 2;
          }
          return null;
        })
        .filter((x) => !!x) as number[];
      targetCellIdx.forEach((col) =>
        colorTextAndBGCell({
          worksheet,
          row: rowNo + 1,
          col,
          textColor: COLOR_HEXCODE.YELLOW,
          cellColor: COLOR_HEXCODE.RED,
        }),
      );

      if (i % 7 === 0) {
        const weeks = distinctShowNames.reduce((acc, { FullProductionCode, ShowName }) => {
          const key = getShowAndProductionKey({ FullProductionCode, ShowName });
          const value = headerWeeks[key];

          if (!value) {
            throw new Error(' Something went wrong');
          }
          if (value === -1) {
            headerWeeks[key] = 1;
          } else {
            headerWeeks[key]++;
          }

          return [...acc, `Week ${value}`];
        }, []);
        worksheet.addRow(['Week No', '', ...weeks]);
        rowNo++;
        fillRowBGColorAndTextColor({
          worksheet,
          row: rowNo + 1,
          textColor: COLOR_HEXCODE.YELLOW,
          cellColor: COLOR_HEXCODE.DARK_BLUE,
          isBold: true,
        });
      }
    }

    const numberOfColumns = worksheet.columnCount;

    worksheet.mergeCells('A1:D1');
    worksheet.mergeCells('A2:C2');

    for (let row = 1; row < 6; row++) {
      styleHeader({ worksheet, row, numberOfColumns });
    }

    for (let char = 'A', i = 0; i <= numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
      if (char === 'A' || char === 'B') {
        worksheet.getColumn(char).width = 12;
      } else {
        worksheet.getColumn(char).width = 20;
      }
      if (char !== 'A') {
        alignColumn({ worksheet, colAsChar: char, align: ALIGNMENT.CENTER });
      }
    }

    worksheet.getColumn('A').width = 11;
    worksheet.getColumn('B').width = 10;
    for (let char = 'C', i = 0; i <= numberOfColumns; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
      let maxWidth = 0;
      worksheet.getColumn(char).eachCell((cell: any, i) => {
        if (i > 2) {
          maxWidth = Math.max(maxWidth, cell.text.length);
        }
      });
      worksheet.getColumn(char).width = maxWidth;
    }

    alignCellText({ worksheet, row: 1, col: 1, align: ALIGNMENT.LEFT });
    alignCellText({ worksheet, row: 2, col: 1, align: ALIGNMENT.LEFT });

    worksheet.getCell(1, 1).font = { size: 16, color: { argb: COLOR_HEXCODE.WHITE }, bold: true };

    const filename = `${title}`;
    if (fileFormat === 'pdf') {
      worksheet.pageSetup.printArea = `A1:${worksheet.getColumn(11).letter}${rowNo}`;
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
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error fetching reports' });
  }
};

export default handler;
