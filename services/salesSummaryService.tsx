
import Decimal from 'decimal.js'
import moment from 'moment'
import { BOOK_STATUS_CODES, TGroupBasedOnWeeksKeepingVenueCommon, TKeyAndGroupBasedOnWeeksKeepingVenueCommonMapping, TRequiredFieldsFinalFormat, TSalesView, UniqueHeadersObject, VENUE_CURRENCY_SYMBOLS, WeekAggregateSeatsDetail, WeekAggregateSeatsDetailCurrencyWise, WeekAggregates } from 'types/SalesSummaryTypes'

export enum COLOR_HEXCODE {
  PURPLE= 'ff7030a0',
  BLUE= 'ff8faadc',
  YELLOW= 'ffffff00',
  GREY= 'ffc8c8c8',
  RED= 'ffff0000',
  WHITE= 'ffffffff',
  BLACK= 'ff000000',
  ORANGE= 'ffff6347',
}

export const formatWeek = (num: number): string => `Week ${num}`
export const getMapKey = (
  { Week, Town, Venue, FormattedSetTourWeekNum, SetTourWeekDate }: Pick<TRequiredFieldsFinalFormat, 'Week' | 'Town' | 'Venue' | 'FormattedSetTourWeekNum' | 'SetTourWeekDate'>
): string => `${Week} | ${Town} | ${Venue} | ${FormattedSetTourWeekNum} | ${SetTourWeekDate}`

export const getMapKeyForValue = (
  { Week, Town, Venue }: Pick<TRequiredFieldsFinalFormat, 'Week' | 'Town' | 'Venue'>,
  { FormattedSetTourWeekNum: setTourWeekNumVar, SetTourWeekDate: setTourWeekDateVar }: Pick<TRequiredFieldsFinalFormat, 'FormattedSetTourWeekNum' | 'SetTourWeekDate'>
): string => `${Week} | ${Town} | ${Venue} | ${setTourWeekNumVar} | ${setTourWeekDateVar}`

export const getAggregateKey = (
  { Week, Town, Venue }
    :{Week: TRequiredFieldsFinalFormat['Week'], Town: TRequiredFieldsFinalFormat['Town'], Venue: TRequiredFieldsFinalFormat['Venue']}
) => `${Week} | ${Town} | ${Venue}`

export const LEFT_PORTION_KEYS: string[] = ['Week', 'Day', 'Date', 'Town', 'Venue']
export const getValuesFromObject = (obj: object, array: any[]): any[] => array.map(key => obj[key])

export const CONSTANTS: {[key:string]: string} = {
  CHANGE_VS: 'Change VS',
  RUN_SEATS: 'Run Seats',
  RUN_SALES: 'Run Sales'
}

export const assignBackgroundColor = ({ worksheet, row, col, props: { SetIsCopy, SetBrochureReleased, BookingStatusCode, Date, SetTourWeekDate, NotOnSalesDate }, meta: { weekCols } }: {worksheet: any, row: number, col: number, props: {SetIsCopy:TSalesView['SetIsCopy'], SetBrochureReleased: TSalesView['SetBrochureReleased'], BookingStatusCode: TSalesView['BookingStatusCode'], Date: TRequiredFieldsFinalFormat['Date'], SetTourWeekDate:TRequiredFields['SetTourWeekDate'], NotOnSalesDate: TRequiredFields['NotOnSalesDate']}, meta: {weekCols: number}}) => {
  if (BookingStatusCode === BOOK_STATUS_CODES.X) {
    const startPoint = 6
    for (let i = 0; i < weekCols; i++) {
      colorCell({ worksheet, row, col: i + startPoint, argbColor: COLOR_HEXCODE.GREY })
    }
  }
  if (Number(SetIsCopy)) {
    colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.PURPLE })
  }
  if (Number(SetBrochureReleased)) {
    colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.YELLOW })
  }

  if (moment(Date).valueOf() < moment(SetTourWeekDate).valueOf()) {
    colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.BLUE })
  }

  if (NotOnSalesDate && (moment(SetTourWeekDate).valueOf() < moment(NotOnSalesDate).valueOf())) {
    colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.RED })
  }
}

export const makeRowTextBold = ({ worksheet, row }: {worksheet: any, row: number}) => {
  worksheet.getRow(row).eachCell((cell) => {
    cell.font = { bold: true }
  })
}

export const fillRowBGColorAndTextColor = ({ worksheet, row, textColor, cellColor, isBold }: {worksheet: any, row: number, textColor: COLOR_HEXCODE, cellColor: COLOR_HEXCODE, isBold?: boolean}) => {
  worksheet.getRow(row).eachCell((cell) => {
    cell.font = { color: { argb: textColor }, ...(isBold && {bold: true}) }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: cellColor }
    }
  })
}

export const makeCellTextBold = ({ worksheet, row, col }: {worksheet: any, row: number, col: number}) => {
  worksheet.getCell(row, col).font = { bold: true }
}

export const makeRowTextBoldAndALignCenter = ({ worksheet, row }: {worksheet: any, row: number}) => {
  worksheet.getRow(row).eachCell((cell) => {
    cell.font = { bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })
}

export const alignCellTextRight = ({ worksheet, colAsChar }: {worksheet: any, colAsChar: string}) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: 'right' }
  })
}

export const colorCell = ({ worksheet, row, col, argbColor }: {worksheet: any, row: number, col: number, argbColor: COLOR_HEXCODE}) => {
  worksheet.getCell(row, col).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: argbColor }
  }
}

export const getUniqueAndSortedHeaderTourColumns = (finalFormattedValues: TRequiredFieldsFinalFormat[]): UniqueHeadersObject[] => {
  const tourColumns:UniqueHeadersObject[] = Array.from(new Set(finalFormattedValues.map(({ FormattedSetTourWeekNum, SetTourWeekDate }) => ({ FormattedSetTourWeekNum, SetTourWeekDate }))))
  const uniqueTourColumns = tourColumns.reduce(({ keys, values }: {keys: string[], values: UniqueHeadersObject[]}, x: UniqueHeadersObject) => {
    const doesKeyExists: boolean = keys.includes(x.FormattedSetTourWeekNum)
    if (doesKeyExists) return { keys, values }
    return {
      keys: [...keys, x.FormattedSetTourWeekNum],
      values: [...values, x]
    }
  }, { keys: [], values: [] }).values

  uniqueTourColumns.sort((a, b) => {
    const t1 = Number(a.FormattedSetTourWeekNum.split(' ')[1])
    const t2 = Number(b.FormattedSetTourWeekNum.split(' ')[1])
    return t1 - t2
  })
  return uniqueTourColumns
}

export const groupBasedOnVenueWeeksKeepingVenueCommon = ({ modifiedFetchedValues }: {modifiedFetchedValues: TRequiredFieldsFinalFormat[]}): TKeyAndGroupBasedOnWeeksKeepingVenueCommonMapping => modifiedFetchedValues.reduce((acc, obj: TRequiredFieldsFinalFormat) => {
  const key: string = getAggregateKey(obj)
  const val: TGroupBasedOnWeeksKeepingVenueCommon = acc[key]
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
            FormattedSetTourWeekNum: obj.FormattedSetTourWeekNum,
            SetTourWeekDate: obj.SetTourWeekDate,
            SetIsCopy: obj.SetIsCopy,
            SetBrochureReleased: obj.SetBrochureReleased,
            Seats: obj.Seats,
            TotalCapacity: obj.TotalCapacity
          // FormattedFinalFiguresValue: obj.FormattedFinalFiguresValue,
          }
        ]
      }
    }
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
          FormattedSetTourWeekNum: obj.FormattedSetTourWeekNum,
          SetTourWeekDate: obj.SetTourWeekDate,
          SetIsCopy: obj.SetIsCopy,
          SetBrochureReleased: obj.SetBrochureReleased
        }
      ]
    }
  }
}, {})

export const handleAddingWeeklyTotalRowForOneCurrencyOnly = ({ worksheet, headerWeekNums, totalRowWeekWise, currencySymbol, lastBookingWeek, totalCurrencyAndWeekWiseSeatsTotal, isSeatsDataRequired = 0 }: { worksheet: any, headerWeekNums: string[], totalRowWeekWise: WeekAggregates, currencySymbol: TSalesView['VenueCurrencySymbol'], lastBookingWeek: string, totalCurrencyAndWeekWiseSeatsTotal: WeekAggregateSeatsDetail, isSeatsDataRequired: number}): {
  numberOfRowsAdded: number
} => {
  if (!lastBookingWeek) {
    return {
      numberOfRowsAdded: 0
    }
  }
  const weekWiseDataInEuro: string[] = headerWeekNums.map(weekNum => getCurrencyWiseTotal({ totalForWeeks: totalRowWeekWise, setTourWeekNum: weekNum, currencySymbol }))
  const rowData: string[] = ['', '', '', '', `Tour ${lastBookingWeek}`, ...weekWiseDataInEuro, getChangeVsLastWeekValue(weekWiseDataInEuro), ...(isSeatsDataRequired ? getSeatsColumnForWeekTotal({ currencySymbol, totalCurrencyWiseSeatsMapping: totalCurrencyAndWeekWiseSeatsTotal }) : [])]
  if (rowData.slice(5, rowData.length).filter(x => x !== `${currencySymbol}0`)?.length) {
    worksheet.addRow(rowData)
    return {
      numberOfRowsAdded: 1
    }
  }
  return {
    numberOfRowsAdded: 0
  }
}

export const handleAddingWeeklyTotalRow = ({ worksheet, headerWeekNums, totalRowWeekWise, lastBookingWeek, totalCurrencyAndWeekWiseSeatsTotal, isSeatsDataRequired = 0 }: { worksheet: any, headerWeekNums: string[], totalRowWeekWise: WeekAggregates, lastBookingWeek: string, totalCurrencyAndWeekWiseSeatsTotal: WeekAggregateSeatsDetail, isSeatsDataRequired: number}): number => {
  const rowsAdded: number = Object.values(VENUE_CURRENCY_SYMBOLS).reduce((acc, currencySymbol) => acc + handleAddingWeeklyTotalRowForOneCurrencyOnly({ worksheet, headerWeekNums, totalRowWeekWise, currencySymbol, lastBookingWeek, totalCurrencyAndWeekWiseSeatsTotal, isSeatsDataRequired }).numberOfRowsAdded, 0)
  return rowsAdded
}

export const calculateCurrVSPrevWeekValue = ({ valuesArrayOnly }: { valuesArrayOnly: string[] }): string => {
  if (valuesArrayOnly?.length === 1) {
    return valuesArrayOnly[0]
  } else {
    const len = valuesArrayOnly.length

    if (valuesArrayOnly[len - 2] || valuesArrayOnly[len - 1]) {
      const prev = valuesArrayOnly[len - 2] ? valuesArrayOnly[len - 2].substring(1) : 0
      const curr = valuesArrayOnly[len - 1] ? valuesArrayOnly[len - 1].substring(1) : 0

      const val = Number(new Decimal(curr).minus(prev).toFixed(2))
      const symbol = valuesArrayOnly[len - 2] ? valuesArrayOnly[len - 2].substring(0, 1) : valuesArrayOnly[len - 1].substring(0, 1)
      const prefix = val >= 0 ? `${symbol}` : `-${symbol}`
      return `${prefix}${val > 0 ? val : -1 * val}`
    } else {
      // Nothing in this condition
    }
  }
  return ''
}

export const makeTextBoldOfNRows = ({ worksheet, startingRow, numberOfRowsAdded }: {worksheet: any, startingRow: number, numberOfRowsAdded: number}) => {
  for (let i = 0; i < numberOfRowsAdded; i++) {
    makeRowTextBold({ worksheet, row: startingRow + i })
  }
}

export const getFileName = (worksheet): string => `${worksheet.getCell(1, 1).value} ${moment().format('DD MM YYYY hh:mm:ss')}.xlsx`

export const getCurrencyWiseTotal = ({ totalForWeeks, setTourWeekNum, currencySymbol }: {totalForWeeks: WeekAggregates, setTourWeekNum: string, currencySymbol: VENUE_CURRENCY_SYMBOLS}): string => {
  const arr = totalForWeeks[setTourWeekNum]

  if (!arr?.length) {
    return `${currencySymbol}0`
  }

  const finalValue = arr.filter(x => x.VenueCurrencySymbol === currencySymbol).map(x => x.Value).reduce((acc, x) => new Decimal(acc).plus(x), 0)
  return `${currencySymbol}${finalValue}`
}

export const getChangeVsLastWeekValue = (weeksDataArray: string[]): string => {
  if (weeksDataArray?.length === 1) {
    return weeksDataArray[0]
  } else {
    const len = weeksDataArray.length

    if (weeksDataArray[len - 2] || weeksDataArray[len - 1]) {
      const prev = weeksDataArray[len - 2] ? weeksDataArray[len - 2].substring(1) : 0
      const curr = weeksDataArray[len - 1] ? weeksDataArray[len - 1].substring(1) : 0

      const val = Number(new Decimal(curr).minus(prev).toFixed(2))
      const symbol = weeksDataArray[len - 2] ? weeksDataArray[len - 2].substring(0, 1) : weeksDataArray[len - 1].substring(0, 1)
      const prefix = val >= 0 ? `${symbol}` : `-${symbol}`
      return `${prefix}${val > 0 ? val : -1 * val}`
    } else {
      // This case should not occur
    }
  }
  return ''
}

export const getWeekWiseGrandTotalInPound = ({ totalForWeeks, setTourWeekNum }: {totalForWeeks: WeekAggregates, setTourWeekNum: string}): string => {
  const arr = totalForWeeks[setTourWeekNum]

  if (!arr?.length) {
    return '£0'
  }

  const finalValue = arr.map(x => x.ConvertedValue).reduce((acc, x) => new Decimal(acc).plus(x), 0)
  return `£${finalValue}`
}

export const getSeatsColumnForWeekTotal = ({ currencySymbol, totalCurrencyWiseSeatsMapping }: {currencySymbol: VENUE_CURRENCY_SYMBOLS, totalCurrencyWiseSeatsMapping: WeekAggregateSeatsDetail}): string[] => {
  const arr: WeekAggregateSeatsDetailCurrencyWise[] = totalCurrencyWiseSeatsMapping[currencySymbol]
  if (!arr || !arr?.length) {
    return []
  }

  const { Seats, TotalCapacity }: { Seats: number, TotalCapacity: number} = arr.reduce((acc, x) => ({ Seats: acc.Seats + x.Seats, TotalCapacity: acc.TotalCapacity + x.TotalCapacity }), { Seats: 0, TotalCapacity: 0 })
  return [String(Seats), String(TotalCapacity), (Seats === 0 || TotalCapacity === 0) ? '0.00%' : `${new Decimal(Seats).div(TotalCapacity).mul(100).toFixed(2)}%`]
}

export const getSeatsDataForTotal = ({ seatsDataForEuro, seatsDataForPound }: {seatsDataForEuro: string[], seatsDataForPound: string[]}): string[] => {
  if (!seatsDataForEuro || !seatsDataForEuro?.length) {
    return seatsDataForPound
  }

  if (!seatsDataForPound || !seatsDataForPound?.length) {
    return seatsDataForEuro
  }

  const seats: number = parseInt(seatsDataForEuro[0]) + parseInt(seatsDataForPound[0])
  const totalSeats: number = parseInt(seatsDataForEuro[1]) + parseInt(seatsDataForPound[1])
  const percentage: string = (seats === 0 || totalSeats === 0) ? '0.00%' : `${new Decimal(seats).div(totalSeats).mul(100).toFixed(2)}%`
  return [String(seats), String(totalSeats), percentage]
}

export const colorTextAndBGCell = ({ worksheet, row, col, textColor, cellColor }: {worksheet: any, row: number, col: number, textColor: COLOR_HEXCODE, cellColor: COLOR_HEXCODE}) => {
  const cell = worksheet.getCell(row, col)
  cell.font = { color: { argb: textColor } }
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: cellColor }
  }
}

export const makeColumnTextBold = ({ worksheet, colAsChar }: {worksheet: any, colAsChar: string}) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.font = { bold: true }
  })
}

export const salesReportName = ({ tourId, isWeeklyReport, isSeatsDataRequired, data }): string => {
  if (data.length) {
    return data[0].ShowName + ' (' + data[0].FullTourCode + ')'
  }

  if (isWeeklyReport) {
    return tourId ? `Sales Summary Weekly - Tour ${tourId},` : 'Sales Summary Weekly'
  }

  if (isSeatsDataRequired) {
    return tourId ? `Sales Vs Capacity - Tour ${tourId},` : 'Sales Vs Capacity'
  }
  return tourId ? `Sales Summary -Tour  ${tourId},` : 'Sales Summary'
}
