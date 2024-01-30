import { Prisma } from '@prisma/client';
import ExcelJS from 'exceljs';
import prisma from 'lib/prisma';
import moment from 'moment';
import Decimal from 'decimal.js';
import { COLOR_HEXCODE, colorCell, colorTextAndBGCell, fillRowBGColorAndTextColor } from 'services/salesSummaryService';

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

enum ALIGNMENT {
  CENTER = 'center',
  RIGHT = 'right',
  LEFT = 'left',
}

const alignColumn = ({ worksheet, colAsChar, align }: { worksheet: any; colAsChar: string; align: ALIGNMENT }) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: align, wrapText: true };
  });
};

const styleHeader = ({ worksheet, row, numberOfColumns }: { worksheet: any; row: number; numberOfColumns: number }) => {
  for (let col = 1; col <= numberOfColumns; col++) {
    const cell = worksheet.getCell(row, col);
    cell.font = { bold: true, color: { argb: COLOR_HEXCODE.WHITE } };
    cell.alignment = { horizontal: ALIGNMENT.CENTER };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: COLOR_HEXCODE.BLUE },
    };
  }
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

const getKey = ({ FullProductionCode, ShowName, EntryDate }) => `${FullProductionCode} - ${ShowName} - ${EntryDate}`;
const formatDate = (date) => moment(date).format('DD/MM/YY');
const getShowAndProductionKey = ({ FullProductionCode, ShowName }) => `${FullProductionCode} - ${ShowName}`;

const handler = async (req, res) => {
  const { fromDate, toDate } = JSON.parse(req.body) || {};

  const formatedFromDate = formatDate(fromDate);
  const formatedToDate = formatDate(toDate);
  if (!fromDate || !toDate) {
    throw new Error('Params are missing');
  }
  const conditions: Prisma.Sql[] = [Prisma.sql`EntryDate BETWEEN ${fromDate} AND ${toDate}`];
  const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty;
  const data: SCHEDULE_VIEW[] = await prisma.$queryRaw`select * FROM ScheduleView ${where} order by EntryDate;`;

  const workbook = new ExcelJS.Workbook();
  const formattedData = data.map((x) => ({
    ...x,
    EntryDate: moment(x.EntryDate).format('YYYY-MM-DD'),
    ProductionStartDate: moment(x.ProductionStartDate).format('YYYY-MM-DD'),
    ProductionEndDate: moment(x.ProductionEndDate).format('YYYY-MM-DD'),
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

  const destinctShowNames: UniqueHeadersObject[] = Object.keys(showNameAndProductionCode)
    .map((key) => {
      return showNameAndProductionCode[key].map((code) => ({ ShowName: key, FullProductionCode: code }));
    })
    .reduce((acc, arr) => [...acc, ...arr], []);

  const worksheet = workbook.addWorksheet('My Sales', {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    views: [{ state: 'frozen', xSplit: 2, ySplit: 6 }],
  });

  worksheet.addRow([`Jendagi Rolling Masterplan ${formatedFromDate} to ${formatedToDate}`]);
  const date = new Date();
  worksheet.addRow([`Exported: ${moment(date).format('DD/MM/YY')} at ${moment(date).format('hh:mm')}`]);
  worksheet.addRow([]);
  worksheet.addRow(['', '', ...destinctShowNames.map((x) => x.ShowName)]);
  worksheet.addRow(['DAY', 'DATE', ...destinctShowNames.map((x) => x.FullProductionCode)]);
  worksheet.addRow([]);

  const map: { [key: string]: SCHEDULE_VIEW } = formattedData.reduce((acc, x) => ({ ...acc, [getKey(x)]: x }), {});
  const showNameAndProductionMap: { [key: string]: SCHEDULE_VIEW } = formattedData.reduce(
    (acc, x) => ({ ...acc, [getShowAndProductionKey(x)]: x }),
    {},
  );

  const headerWeeks =
    destinctShowNames.reduce((acc, { ShowName, FullProductionCode }) => {
      const key = getShowAndProductionKey({ FullProductionCode, ShowName });
      const value = showNameAndProductionMap[key];
      if (!value) {
        throw new Error('Missing Data');
      }

      const daysDiff = moment(fromDate).diff(moment(value.ProductionStartDate), 'days');
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

  const weeks = destinctShowNames.reduce((acc, { FullProductionCode, ShowName }) => {
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
  worksheet.addRow(['Week Minus', '', ...weeks]);
  fillRowBGColorAndTextColor({
    worksheet,
    row: 7,
    textColor: COLOR_HEXCODE.YELLOW,
    cellColor: COLOR_HEXCODE.DARK_BLUE,
    isBold: true,
  });

  const daysDiff = moment(toDate).diff(moment(fromDate), 'days');

  const minRehersalStartTimeInEpoch = data.reduce((acc, x) => {
    if (x.RehearsalStartDate && new Date(x.RehearsalStartDate).getTime() < acc) {
      acc = new Date(x.RehearsalStartDate).getTime();
    }
    return acc;
  }, Infinity);

  let rowNo = 6;
  for (let i = 1; i <= daysDiff; i++) {
    const weekDay = moment(moment(fromDate).add(i - 1, 'day')).format('dddd');
    const dateInIncomingFormat = moment(moment(fromDate).add(i - 1, 'day')).format('YYYY-MM-DD');
    const date = formatDate(dateInIncomingFormat);

    const values: string[] = destinctShowNames.map(({ FullProductionCode, ShowName }) => {
      const key = getKey({ FullProductionCode, ShowName, EntryDate: dateInIncomingFormat });
      const value = map[key];
      if (value) {
        return value.EntryName;
      }
      return '';
    });

    worksheet.addRow([weekDay, date, ...values]);
    rowNo++;

    if (weekDay === 'Monday' && new Date(dateInIncomingFormat).getTime() >= minRehersalStartTimeInEpoch) {
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
      // worksheet.addRow([])
      // rowNo++
      const weeks = destinctShowNames.reduce((acc, { FullProductionCode, ShowName }) => {
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
      worksheet.addRow(['Week Minus', '', ...weeks]);
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

  const filename = 'Master Plan.xlsx';
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  workbook.xlsx.write(res).then(() => {
    res.end();
  });
};

export default handler;
