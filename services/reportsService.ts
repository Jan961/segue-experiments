import cheerio from 'cheerio';
import { COLOR_HEXCODE } from './salesSummaryService';

export const addWidthAsPerContent = ({
  worksheet,
  fromColNumber,
  toColNumber,
  startingColAsCharWIthCapsOn,
  minColWidth = 10,
  maxColWidth = 60,
  bufferWidth = 0,
  rowsToIgnore,
  htmlFields = [],
}: {
  worksheet: any;
  fromColNumber: number;
  toColNumber: number;
  startingColAsCharWIthCapsOn: string;
  minColWidth?: number;
  maxColWidth?: number;
  bufferWidth?: number;
  rowsToIgnore: number;
  htmlFields?: string[];
}) => {
  for (
    let char = startingColAsCharWIthCapsOn, i = fromColNumber;
    i <= toColNumber;
    i++, char = String.fromCharCode(char.charCodeAt(0) + 1)
  ) {
    let maxWidth = 0;
    worksheet.getColumn(char).eachCell((cell: any, rowNumber: number) => {
      if (rowNumber > rowsToIgnore) {
        const cellValue = cell.value;
        const cellText = cellValue ? cellValue.toString() : ''; // Convert to string safely
        maxWidth = Math.max(maxWidth, htmlFields.includes(char) ? getHTMLFieldMaxWidth(cellText) : cellText.length);
      }
    });
    worksheet.getColumn(char).width = getWidthConsideringThresholds({
      max: maxColWidth,
      min: minColWidth,
      val: maxWidth,
      buffer: bufferWidth,
    });
  }
};

const getWidthConsideringThresholds = ({ max, min, val, buffer = 0 }) => {
  if (!max && !min) {
    return val + buffer;
  }

  if (max && min) {
    return Math.min(Math.max(min, val + buffer), max);
  }

  return max ? Math.min(val + buffer, max) : Math.max(val + buffer, min);
};

const getHTMLFieldMaxWidth = (text: string) => {
  let maxWidth = 0;
  // eslint-disable-next-line array-callback-return
  text.split('\n').map((htmlString) => {
    const $: any = cheerio.load(htmlString);
    const line = $.text?.();
    maxWidth = Math.max(maxWidth, line.length);
  });
  return maxWidth;
};

export const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

export const applyGradientFillToColumn = ({
  worksheet,
  columnIndex,
  progressData,
  startingRow,
}: {
  worksheet: any;
  columnIndex: number;
  progressData: number[];
  startingRow: number;
}) => {
  for (let i = startingRow; i <= startingRow + progressData.length - 1; i++) {
    const cell = worksheet.getCell(`${String.fromCharCode(65 + columnIndex)}${i}`);
    const progress = progressData[i - startingRow] / 100;
    cell.fill = {
      type: 'gradient',
      gradient: 'angle',
      degree: 0,
      stops: [
        ...((progress === 0 && [{ position: 0, color: { argb: COLOR_HEXCODE.WHITE } }]) || []),
        { position: 0, color: { argb: COLOR_HEXCODE.TASK_GREEN } },
        { position: progress, color: { argb: COLOR_HEXCODE.TASK_GREEN } },
        ...(((progress < 1 || progress === 0) && [{ position: 1, color: { argb: COLOR_HEXCODE.WHITE } }]) || []),
      ],
    };
  }
};
