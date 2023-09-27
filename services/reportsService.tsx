import moment from 'moment'
import cheerio from 'cheerio'

export const addWidthAsPerContent = ({
  worksheet,
  fromColNumber,
  toColNumber,
  startingColAsCharWIthCapsOn,
  minColWidth = 10,
  maxColWidth = 60,
  bufferWidth = 0,
  rowsToIgnore,
  htmlFields = []
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
    let maxWidth = 0
    worksheet.getColumn(char).eachCell((cell: any, i) => {
      if (i > rowsToIgnore) {
        maxWidth = Math.max(
          maxWidth,
          htmlFields.includes(char)
            ? getHTMLFieldMaxWidth(cell.text)
            : cell.text.length
        )
      }
    })
    worksheet.getColumn(char).width = getWidthConsideringThresholds({
      max: maxColWidth,
      min: minColWidth,
      val: maxWidth,
      buffer: bufferWidth
    })
  }
}

const getWidthConsideringThresholds = ({ max, min, val, buffer = 0 }) => {
  if (!max && !min) {
    return val + buffer
  }

  if (max && min) {
    return Math.min(Math.max(min, val + buffer), max)
  }

  return max ? Math.min(val + buffer, max) : Math.max(val + buffer, min)
}

const getHTMLFieldMaxWidth = (text: string) => {
  let maxWidth = 0
  // eslint-disable-next-line array-callback-return
  text.split('\n').map((htmlString) => {
    const $ = cheerio.load(htmlString)
    const line = $.text()
    maxWidth = Math.max(maxWidth, line.length)
  })
  return maxWidth
}

export const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index)

export const getCurrentMondayDate = () => {
  const currentMonday = moment(new Date())
    .startOf('isoWeek')
    .set('hour', 0)
    .add(1, 'day')
  return currentMonday.toISOString()?.split('T')?.[0]
}
