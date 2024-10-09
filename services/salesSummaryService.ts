import Decimal from 'decimal.js';
import moment from 'moment';
import * as ExcelJS from 'exceljs';
import {
  BOOK_STATUS_CODES,
  TGroupBasedOnWeeksKeepingVenueCommon,
  TKeyAndGroupBasedOnWeeksKeepingVenueCommonMapping,
  TRequiredFields,
  TRequiredFieldsFinalFormat,
  TSalesView,
  UniqueHeadersObject,
  VENUE_CURRENCY_SYMBOLS,
  WeekAggregateSeatsDetail,
  WeekAggregateSeatsDetailCurrencyWise,
  WeekAggregates,
} from 'types/SalesSummaryTypes';

export enum COLOR_HEXCODE {
  PURPLE = 'ff7030a0',
  BLUE = 'ff8faadc',
  YELLOW = 'ffffff00',
  GREY = 'ffc8c8c8',
  RED = 'ffff0000',
  WHITE = 'ffffffff',
  BLACK = 'ff000000',
  ORANGE = 'ffff6347',
  CREAM = 'ffedb150',
  DARK_BLUE = 'ff2f75b5',
  LIGHT_GREY = 'ffc8c8c8',
  DARK_ORANGE = 'ffec6255',
  DARK_GREEN = 'ff41a29a',
  BORDER_GRAY = 'ffc8c8c8',
  TASK_GREEN = 'ff10841c',
  TASK_RED = 'ffd41818',
  TASK_YELLOW = 'ffffbe43',
  TASK_AMBER = 'ffea8439',
}

export const formatWeek = (num: number): string => `Week ${num}`;
export const getMapKey = ({
  Week,
  Town,
  Venue,
  FormattedSetProductionWeekNum,
  SetProductionWeekDate,
}: Pick<
  TRequiredFieldsFinalFormat,
  'Week' | 'Town' | 'Venue' | 'FormattedSetProductionWeekNum' | 'SetProductionWeekDate'
>): string => `${Week} | ${Town} | ${Venue} | ${FormattedSetProductionWeekNum} | ${SetProductionWeekDate}`;

export const getMapKeyForValue = (
  { Week, Town, Venue }: Pick<TRequiredFieldsFinalFormat, 'Week' | 'Town' | 'Venue'>,
  {
    FormattedSetProductionWeekNum: setProductionWeekNumVar,
    SetProductionWeekDate: setProductionWeekDateVar,
  }: Pick<TRequiredFieldsFinalFormat, 'FormattedSetProductionWeekNum' | 'SetProductionWeekDate'>,
): string => `${Week} | ${Town} | ${Venue} | ${setProductionWeekNumVar} | ${setProductionWeekDateVar}`;

export const convertDateFormat = (date) => {
  const parsedDate = moment(date, 'DD-MM-YYYY');
  return parsedDate.format('DD/MM/YY');
};

export const getAggregateKey = ({
  Week,
  Town,
  Venue,
}: {
  Week: TRequiredFieldsFinalFormat['Week'];
  Town: TRequiredFieldsFinalFormat['Town'];
  Venue: TRequiredFieldsFinalFormat['Venue'];
}) => `${Week} | ${Town} | ${Venue}`;

export const LEFT_PORTION_KEYS: string[] = ['Week', 'Day', 'Date', 'Town', 'Venue'];
export const getValuesFromObject = (obj: object, array: any[]): any[] =>
  array.map((key) => {
    if (key === 'Day') {
      return obj[key].substring(0, 3);
    }
    if (key === 'Date') {
      return convertDateFormat(obj[key]);
    }
    return obj[key];
  });

export const CONSTANTS: { [key: string]: string } = {
  CHANGE_VS: 'Change vs',
  RUN_SEATS: 'Run Seats',
  RUN_SALES: 'Run Sales',
};

export const assignBackgroundColor = ({
  worksheet,
  row,
  col,
  props: { SetIsCopy, SetBrochureReleased, BookingStatusCode, Date, SetProductionWeekDate, NotOnSalesDate },
  meta: { weekCols },
}: {
  worksheet: any;
  row: number;
  col: number;
  props: {
    SetIsCopy: TSalesView['SetIsCopy'];
    SetBrochureReleased: TSalesView['SetBrochureReleased'];
    BookingStatusCode: TSalesView['BookingStatusCode'];
    Date: TRequiredFieldsFinalFormat['Date'];
    SetProductionWeekDate: TRequiredFields['SetProductionWeekDate'];
    NotOnSalesDate: TRequiredFields['NotOnSalesDate'];
  };
  meta: { weekCols: number };
}) => {
  if (Number(SetIsCopy)) {
    colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.PURPLE });
  }
  if (Number(SetBrochureReleased)) {
    colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.YELLOW });
  }

  if (moment(Date).valueOf() < moment(SetProductionWeekDate).valueOf()) {
    colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.BLUE });
  }

  if (NotOnSalesDate && moment(SetProductionWeekDate).valueOf() < moment(NotOnSalesDate).valueOf()) {
    colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.RED });
  }
  if (BookingStatusCode === BOOK_STATUS_CODES.X) {
    const startPoint = 6;
    for (let i = 0; i < weekCols; i++) {
      colorTextAndBGCell({
        worksheet,
        row,
        col: i + startPoint,
        cellColor: COLOR_HEXCODE.WHITE,
        textColor: COLOR_HEXCODE.LIGHT_GREY,
      });
    }
  }
};

export const makeRowTextBold = ({ worksheet, row }: { worksheet: any; row: number }) => {
  worksheet.getRow(row).eachCell((cell) => {
    cell.font = { bold: true };
  });
};

export const makeRowTextNormal = ({ worksheet, row }: { worksheet: any; row: number }) => {
  worksheet.getRow(row).eachCell((cell) => {
    cell.font = { bold: false };
  });
};

export const fillRowBGColorAndTextColor = ({
  worksheet,
  row,
  textColor,
  cellColor,
  isBold,
}: {
  worksheet: any;
  row: number;
  textColor: COLOR_HEXCODE;
  cellColor: COLOR_HEXCODE;
  isBold?: boolean;
}) => {
  worksheet.getRow(row).eachCell((cell) => {
    cell.font = { color: { argb: textColor }, ...(isBold && { bold: true }) };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: cellColor },
    };
  });
};

export const makeCellTextBold = ({ worksheet, row, col }: { worksheet: any; row: number; col: number }) => {
  worksheet.getCell(row, col).font = { bold: true };
};

export const makeRowTextBoldAndALignCenter = ({ worksheet, row }: { worksheet: any; row: number }) => {
  worksheet.getRow(row).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });
};

export const alignCellTextRight = ({ worksheet, colAsChar }: { worksheet: any; colAsChar: string }) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: 'right' };
  });
};

export const colorCell = ({
  worksheet,
  row,
  col,
  argbColor,
}: {
  worksheet: any;
  row: number;
  col: number;
  argbColor: COLOR_HEXCODE;
}) => {
  worksheet.getCell(row, col).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: argbColor },
  };
};
export const addCellBorder = ({
  worksheet,
  row,
  col,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  argbColor,
}: {
  worksheet: any;
  row: number;
  col: number;
  argbColor: COLOR_HEXCODE;
}) => {
  worksheet.getCell(row, col).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
};

export const getUniqueAndSortedHeaderProductionColumns = (
  finalFormattedValues: TRequiredFieldsFinalFormat[],
): UniqueHeadersObject[] => {
  const productionColumns: UniqueHeadersObject[] = Array.from(
    new Set(
      finalFormattedValues.map(({ FormattedSetProductionWeekNum, SetProductionWeekDate }) => ({
        FormattedSetProductionWeekNum,
        SetProductionWeekDate,
      })),
    ),
  );
  const uniqueProductionColumns = productionColumns.reduce(
    ({ keys, values }: { keys: string[]; values: UniqueHeadersObject[] }, x: UniqueHeadersObject) => {
      const doesKeyExists: boolean = keys.includes(x.FormattedSetProductionWeekNum);
      if (doesKeyExists) return { keys, values };
      return {
        keys: [...keys, x.FormattedSetProductionWeekNum],
        values: [...values, x],
      };
    },
    { keys: [], values: [] },
  ).values;

  uniqueProductionColumns.sort((a, b) => {
    const t1 = Number(a.FormattedSetProductionWeekNum.split(' ')[1]);
    const t2 = Number(b.FormattedSetProductionWeekNum.split(' ')[1]);
    return t1 - t2;
  });
  return uniqueProductionColumns;
};

export const groupBasedOnVenueWeeksKeepingVenueCommon = ({
  modifiedFetchedValues,
}: {
  modifiedFetchedValues: TRequiredFieldsFinalFormat[];
}): TKeyAndGroupBasedOnWeeksKeepingVenueCommonMapping =>
  modifiedFetchedValues.reduce((acc, obj: TRequiredFieldsFinalFormat) => {
    const key: string = getAggregateKey(obj);
    const val: TGroupBasedOnWeeksKeepingVenueCommon = acc[key];
    if (val) {
      return {
        ...acc,
        [key]: {
          ...val,
          data: [
            ...val.data,
            {
              Value: obj.Value,
              FormattedValue: obj.FormattedValue,
              ConversionRate: obj.ConversionRate,
              VenueCurrencySymbol: obj.VenueCurrencySymbol,
              FormattedSetProductionWeekNum: obj.FormattedSetProductionWeekNum,
              SetProductionWeekDate: obj.SetProductionWeekDate,
              SetIsCopy: obj.SetIsCopy,
              SetBrochureReleased: obj.SetBrochureReleased,
              Seats: obj.Seats,
              TotalCapacity: obj.TotalCapacity,
              // FormattedFinalFiguresValue: obj.FormattedFinalFiguresValue,
            },
          ],
        },
      };
    }
    return {
      ...acc,
      [key]: {
        Week: obj.Week,
        Day: obj.Day,
        Date: obj.Date,
        Town: obj.Town,
        Venue: obj.Venue,
        BookingStatusCode: obj.BookingStatusCode, // NOTE - It will be same for the Venue's all weeks
        FormattedFinalFiguresValue: obj.FormattedFinalFiguresValue,
        VenueCurrencySymbol: obj.VenueCurrencySymbol,
        ConversionRate: obj.ConversionRate, // This we need to handle the scenario of totals
        NotOnSalesDate: obj.NotOnSalesDate, // Assuming this to be same for a Show and Venue
        data: [
          {
            Value: obj.Value,
            FormattedValue: obj.FormattedValue,
            ConversionRate: obj.ConversionRate,
            VenueCurrencySymbol: obj.VenueCurrencySymbol,
            FormattedSetProductionWeekNum: obj.FormattedSetProductionWeekNum,
            SetProductionWeekDate: obj.SetProductionWeekDate,
            SetIsCopy: obj.SetIsCopy,
            SetBrochureReleased: obj.SetBrochureReleased,
          },
        ],
      },
    };
  }, {});

export const handleAddingWeeklyTotalRowForOneCurrencyOnly = ({
  worksheet,
  headerWeekNums,
  totalRowWeekWise,
  currencySymbol,
  lastBookingWeek,
  totalCurrencyAndWeekWiseSeatsTotal,
  isSeatsDataRequired = 0,
}: {
  worksheet: any;
  headerWeekNums: string[];
  totalRowWeekWise: WeekAggregates;
  currencySymbol: TSalesView['VenueCurrencySymbol'];
  lastBookingWeek: string;
  totalCurrencyAndWeekWiseSeatsTotal: WeekAggregateSeatsDetail;
  isSeatsDataRequired: number;
}): {
  numberOfRowsAdded: number;
} => {
  if (!lastBookingWeek) {
    return {
      numberOfRowsAdded: 0,
    };
  }
  const weekWiseDataInEuro: number[] = headerWeekNums.map((weekNum) =>
    getCurrencyWiseTotal({ totalForWeeks: totalRowWeekWise, setProductionWeekNum: weekNum, currencySymbol }),
  );
  const rowData: (string | number)[] = [
    '',
    '',
    '',
    '',
    `Production ${lastBookingWeek}`,
    ...weekWiseDataInEuro,
    getChangeVsLastWeekValue(weekWiseDataInEuro),
    ...(isSeatsDataRequired
      ? getSeatsColumnForWeekTotal({
          currencySymbol,
          totalCurrencyWiseSeatsMapping: totalCurrencyAndWeekWiseSeatsTotal,
        })
      : []),
  ];
  if (rowData.slice(5, rowData.length).filter((x) => x && x !== 0)?.length) {
    worksheet.addRow(rowData);
    applyFormattingToRange({
      worksheet,
      startRow: worksheet.rowCount,
      startColumn: worksheet.getColumn(6).letter,
      endRow: worksheet.rowCount,
      endColumn: worksheet.getColumn(7 + weekWiseDataInEuro.length + 1).letter,
      formatOptions: { numFmt: currencySymbol + '#,##0.00' },
    });
    return {
      numberOfRowsAdded: 1,
    };
  }
  return {
    numberOfRowsAdded: 0,
  };
};

export const handleAddingWeeklyTotalRow = ({
  worksheet,
  headerWeekNums,
  totalRowWeekWise,
  lastBookingWeek,
  totalCurrencyAndWeekWiseSeatsTotal,
  isSeatsDataRequired = 0,
}: {
  worksheet: any;
  headerWeekNums: string[];
  totalRowWeekWise: WeekAggregates;
  lastBookingWeek: string;
  totalCurrencyAndWeekWiseSeatsTotal: WeekAggregateSeatsDetail;
  isSeatsDataRequired: number;
}): number => {
  const rowsAdded: number = Object.values(VENUE_CURRENCY_SYMBOLS).reduce(
    (acc, currencySymbol) =>
      acc +
      handleAddingWeeklyTotalRowForOneCurrencyOnly({
        worksheet,
        headerWeekNums,
        totalRowWeekWise,
        currencySymbol,
        lastBookingWeek,
        totalCurrencyAndWeekWiseSeatsTotal,
        isSeatsDataRequired,
      }).numberOfRowsAdded,
    0,
  );
  return rowsAdded;
};

export const calculateCurrVSPrevWeekValue = ({ valuesArrayOnly }: { valuesArrayOnly: number[] }): number => {
  if (valuesArrayOnly?.length === 1) {
    return valuesArrayOnly[0];
  } else {
    const len = valuesArrayOnly.length;

    // if (valuesArrayOnly[len - 2] || valuesArrayOnly[len - 1]) {
    //   const prev = valuesArrayOnly[len - 2] ? valuesArrayOnly[len - 2] : 0
    //   const curr = valuesArrayOnly[len - 1] ? valuesArrayOnly[len - 1] : 0

    const val = valuesArrayOnly[len - 1] - valuesArrayOnly[len - 2];
    // Number(new Decimal(curr).minus(prev).toFixed(2))
    // const symbol = valuesArrayOnly[len - 2] ? valuesArrayOnly[len - 2] : valuesArrayOnly[len - 1]
    // const prefix = val >= 0 ? `${symbol}` : `-${symbol}`
    return val > 0 ? val : -1 * val;
    // `${prefix}${val > 0 ? val : -1 * (val)}`
    // } else {
    // Nothing in this condition
    // }
  }
  // return 0
};

export const makeTextBoldOfNRows = ({
  worksheet,
  startingRow,
  numberOfRowsAdded,
}: {
  worksheet: any;
  startingRow: number;
  numberOfRowsAdded: number;
}) => {
  for (let i = 0; i < numberOfRowsAdded; i++) {
    makeRowTextBold({ worksheet, row: startingRow + i });
  }
};

export const getFileName = (worksheet): string =>
  `${worksheet.getCell(1, 1).value} ${moment().format('DD MM YYYY hh:mm:ss')}.xlsx`;

export const getCurrencyWiseTotal = ({
  totalForWeeks,
  setProductionWeekNum,
  currencySymbol,
}: {
  totalForWeeks: WeekAggregates;
  setProductionWeekNum: string;
  currencySymbol: VENUE_CURRENCY_SYMBOLS;
}): number => {
  const arr = totalForWeeks[setProductionWeekNum];

  if (!arr?.length) {
    return 0;
    // `${currencySymbol}0`
  }

  const finalValue = arr
    .filter((x) => x.VenueCurrencySymbol === currencySymbol)
    .map((x) => x.Value)
    .reduce((acc, x) => new Decimal(acc).plus(x) as any, 0);
  return finalValue?.toNumber?.();
  // `${currencySymbol}${formatNumberWithNDecimal(finalValue, 2)}`
};

export const getChangeVsLastWeekValue = (weeksDataArray: number[]): number => {
  if (weeksDataArray?.length === 1) {
    return weeksDataArray[0];
  } else {
    const len = weeksDataArray.length;

    // if (weeksDataArray[len - 2] || weeksDataArray[len - 1]) {
    // const prev = weeksDataArray[len - 2] ? weeksDataArray[len - 2] : 0
    // const curr = weeksDataArray[len - 1] ? weeksDataArray[len - 1] : 0

    const val = weeksDataArray[len - 1] - weeksDataArray[len - 2];
    // Number(new Decimal(curr).minus(prev).toFixed(2))
    // const symbol = weeksDataArray[len - 2] ? weeksDataArray[len - 2].substring(0, 1) : weeksDataArray[len - 1].substring(0, 1)
    // const prefix = val >= 0 ? `${symbol}` : `-${symbol}`
    if (isNaN(val)) {
      return 0;
    }
    return val > 0 ? val : -1 * val;
    // `${prefix}${val > 0 ? val : -1 * (val)}`
    // } else {
    // This case should not occur
    // }
  }
};

export const formatNumberWithNDecimal = (num, numberOfDecimals) => {
  if (num === '') {
    return '';
  }
  if (num === 0) return '0.00';
  return parseFloat(num).toFixed(numberOfDecimals);
};

export const formatCurrencyNumberWithNDecimal = (valAsString, numberOfDecimals = 2) => {
  if (valAsString === '') return '';
  return `${valAsString[0]}${formatNumberWithNDecimal(Number(valAsString.substring(1)), numberOfDecimals)}`;
};

export const getWeekWiseGrandTotalInPound = ({
  totalForWeeks,
  setProductionWeekNum,
}: {
  totalForWeeks: WeekAggregates;
  setProductionWeekNum: string;
}): number => {
  const arr = totalForWeeks[setProductionWeekNum];

  if (!arr?.length) {
    return 0;
    // '£0'
  }

  const finalValue = arr.map((x) => x.ConvertedValue).reduce((acc, x) => acc.plus(x), new Decimal(0));
  return finalValue?.toNumber?.();
  // `£${formatNumberWithNDecimal(finalValue, 2)}`
};

export const getSeatsColumnForWeekTotal = ({
  currencySymbol,
  totalCurrencyWiseSeatsMapping,
}: {
  currencySymbol: VENUE_CURRENCY_SYMBOLS;
  totalCurrencyWiseSeatsMapping: WeekAggregateSeatsDetail;
}): number[] => {
  const arr: WeekAggregateSeatsDetailCurrencyWise[] = totalCurrencyWiseSeatsMapping[currencySymbol];
  if (!arr || !arr?.length) {
    return [];
  }

  const { Seats, TotalCapacity }: { Seats: number; TotalCapacity: number } = arr.reduce(
    (acc, x) => ({ Seats: acc.Seats + x.Seats, TotalCapacity: acc.TotalCapacity + x.TotalCapacity }),
    { Seats: 0, TotalCapacity: 0 },
  );
  return [Seats, TotalCapacity, Seats === 0 || TotalCapacity === 0 ? 0 : Seats / TotalCapacity];
};

export const getSeatsDataForTotal = ({
  seatsDataForEuro,
  seatsDataForPound,
}: {
  seatsDataForEuro: number[];
  seatsDataForPound: number[];
}): number[] => {
  if (!seatsDataForEuro || !seatsDataForEuro?.length) {
    return seatsDataForPound;
  }

  if (!seatsDataForPound || !seatsDataForPound?.length) {
    return seatsDataForEuro;
  }

  const seats: number = seatsDataForEuro[0] + seatsDataForPound[0];
  const totalSeats: number = seatsDataForEuro[1] + seatsDataForPound[1];
  const percentage: number = seats === 0 || totalSeats === 0 ? 0 : seats / totalSeats;
  // `${new Decimal(seats).div(totalSeats).mul(100).toFixed(2)}%`
  return [seats, totalSeats, percentage];
};

export const colorTextAndBGCell = ({
  worksheet,
  row,
  col,
  textColor,
  cellColor,
}: {
  worksheet: any;
  row: number;
  col: number;
  textColor: COLOR_HEXCODE;
  cellColor: COLOR_HEXCODE;
}) => {
  const cell = worksheet.getCell(row, col);
  if (textColor) {
    cell.font = { color: { argb: textColor } };
  }
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: cellColor },
  };
};

export const colorTextAndBGAndItalicCell = ({
  worksheet,
  row,
  col,
  textColor,
  cellColor,
}: {
  worksheet: any;
  row: number;
  col: number;
  textColor: COLOR_HEXCODE;
  cellColor: COLOR_HEXCODE;
}) => {
  const cell = worksheet.getCell(row, col);
  cell.font = { color: { argb: textColor }, italic: true };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: cellColor },
  };
};

export const topAndBottomBorder = ({
  worksheet,
  row,
  colFrom,
  colTo,
  borderStyle,
}: {
  worksheet: any;
  row: number;
  colFrom: number;
  colTo: number;
  borderStyle: string;
}) => {
  for (let col = colFrom; col <= colTo; col++) {
    worksheet.getCell(row, col).border = {
      top: { style: borderStyle },
      bottom: { style: borderStyle },
    };
  }
};

export const minutesInHHmmFormat = (min: number) => {
  return moment.utc(moment.duration(min, 'minutes').asMilliseconds()).format('HH:mm');
};
export const makeColumnTextBold = ({ worksheet, colAsChar }: { worksheet: any; colAsChar: string }) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.font = { ...(cell.font || {}), bold: true };
  });
};

export const salesReportName = ({ isWeeklyReport, isSeatsDataRequired, data }): string => {
  if (isSeatsDataRequired) {
    return `Sales Summary Vs Capacity`;
  }

  if (isWeeklyReport) {
    return `Sales Summary Weekly`;
  }

  if (data.length) {
    const { ShowName, FullProductionCode } = data[0];
    return `${FullProductionCode} ${ShowName} Sales Summary`;
  }

  return `Sales Summary`;
};

export const applyFormattingToRange = ({
  worksheet,
  startRow,
  startColumn,
  endRow,
  endColumn,
  formatOptions,
}: {
  worksheet: ExcelJS.Worksheet;
  startRow: number;
  startColumn: string;
  endRow: number;
  endColumn: string;
  formatOptions: any;
}) => {
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startColumn; col <= endColumn; col = String.fromCharCode(col.charCodeAt(0) + 1)) {
      const cell = worksheet.getCell(`${col}${row}`);

      if (formatOptions.font) {
        cell.font = formatOptions.font;
      }
      if (formatOptions.fill) {
        cell.fill = formatOptions.fill;
      }
      if (formatOptions.border) {
        cell.border = formatOptions.border;
      }
      if (formatOptions.alignment) {
        cell.alignment = formatOptions.alignment;
      }
      if (formatOptions.numFmt) {
        cell.numFmt = formatOptions.numFmt;
      }
    }
  }
};

export const alignColumnTextHorizontally = ({
  worksheet,
  colAsChar,
  align,
}: {
  worksheet: any;
  colAsChar: string;
  align: string;
}) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: align };
  });
};
