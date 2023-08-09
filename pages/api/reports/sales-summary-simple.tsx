import { Prisma } from '@prisma/client'
import ExcelJS from 'exceljs'
import prisma from 'lib/prisma'
import moment from 'moment'
import Decimal from 'decimal.js'
import { COLOR_HEXCODE, alignCellTextRight, assignBackgroundColor, calculateCurrVSPrevWeekValue, colorCell, getChangeVsLastWeekValue, getCurrencyWiseTotal, getFileName, getMapKeyForValue, getValuesFromObject, getWeekWiseGrandTotalInPound, handleAddingWeeklyTotalRow, makeRowTextBold, makeRowTextBoldAndALignCenter, makeTextBoldOfNRows, groupBasedOnVenueWeeksKeepingVenueCommon, CONSTANTS, getUniqueAndSortedHeaderTourColumns, getMapKey, formatWeek, LEFT_PORTION_KEYS, getSeatsColumnForWeekTotal, getSeatsDataForTotal, makeColumnTextBold, makeCellTextBold, salesReportName, addCellBorder } from 'services/salesSummaryService'
import { SALES_TYPE_NAME, TGroupBasedOnWeeksKeepingVenueCommon, TKeyAndGroupBasedOnWeeksKeepingVenueCommonMapping, TRequiredFields, TRequiredFieldsFinalFormat, TSalesView, TotalForSheet, UniqueHeadersObject, VENUE_CURRENCY_SYMBOLS, WeekAggregateSeatsDetail, WeekAggregates } from 'types/SalesSummaryTypes'

const handler = async (req, res) => {
  const { tourId, fromWeek, toWeek, isWeeklyReport, isSeatsDataRequired } = JSON.parse(req.body) || {}
  const workbook = new ExcelJS.Workbook()
  const conditions: Prisma.Sql[] = []
  if (tourId) {
    conditions.push(Prisma.sql`TourId = ${parseInt(tourId)}`)
  }
  if (fromWeek && toWeek) {
    conditions.push(Prisma.sql`setTourWeekDate BETWEEN ${fromWeek} AND ${toWeek}`)
  }
  const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty
  const data: TSalesView[] = await prisma.$queryRaw`select * FROM SalesView ${where} order by BookingFirstDate, SetSalesFiguresDate;`

  const jsonArray: TRequiredFields[] = data.filter(x => x.SaleTypeName === SALES_TYPE_NAME.GENERAL_SALES).map(({ BookingTourWeekNum, BookingFirstDate, VenueTown, VenueName, Value, VenueCurrencySymbol, SetTourWeekNum, SetTourWeekDate, ConversionRate, SetIsCopy, SetBrochureReleased, BookingStatusCode, FinalFiguresValue, TotalCapacity, Seats, NotOnSalesDate }) => ({ BookingTourWeekNum, BookingFirstDate, VenueTown, VenueName, Value, VenueCurrencySymbol, SetTourWeekNum, SetTourWeekDate, ConversionRate, SetIsCopy, SetBrochureReleased, BookingStatusCode, FinalFiguresValue, TotalCapacity, Seats, NotOnSalesDate }))
  const finalFormattedValues: TRequiredFieldsFinalFormat[] = jsonArray.map((x: TRequiredFields) => ({ ...x, Week: formatWeek(x.BookingTourWeekNum), FormattedValue: x.Value ? `${x.VenueCurrencySymbol}${x.Value}` : '', Value: x.Value || 0, FormattedSetTourWeekNum: formatWeek(x.SetTourWeekNum), FormattedFinalFiguresValue: x.FinalFiguresValue ? `${x.VenueCurrencySymbol}${x.FinalFiguresValue}` : '', Day: moment(x.BookingFirstDate).format('dddd'), Date: x.BookingFirstDate, Town: x.VenueTown, Venue: x.VenueName }))

  // Write data to the worksheet
  const worksheet = workbook.addWorksheet('My Sales', {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
    views: [{ state: 'frozen', xSplit: 5, ySplit: 5 }]
  })

  const mapOfCreatedKeyAndModifiedFetchedValue: {[key: string]: TRequiredFieldsFinalFormat} = finalFormattedValues.reduce((acc, x) => ({
    ...acc,
    [getMapKey(x)]: x
  }), {})

  // Logic for headers
  const uniqueTourColumns: UniqueHeadersObject[] = getUniqueAndSortedHeaderTourColumns(finalFormattedValues)
  const headerWeekNums: string[] = uniqueTourColumns.map(x => x.FormattedSetTourWeekNum)
  const headerWeekDates: string[] = uniqueTourColumns.map(x => x.SetTourWeekDate)

  // Adding Heading
  worksheet.addRow([salesReportName({ tourId, isWeeklyReport, isSeatsDataRequired, data })])
  // worksheet.getCell(1, 1).value = data?.length ? data[0].ShowName + ' (' + data[0].FullTourCode + ')' : 'Dummy Report'
  worksheet.addRow([])

  // Adding Table Columns
  const columns: string[] = ['Tour', '', '', '', '', ...uniqueTourColumns.map(x => x.FormattedSetTourWeekNum), CONSTANTS.CHANGE_VS, ...(isSeatsDataRequired ? [CONSTANTS.RUN_SEATS, CONSTANTS.RUN_SEATS, CONSTANTS.RUN_SALES] : [])]
  worksheet.addRow(columns)
  worksheet.addRow(['Week', 'Day', 'Date', 'Town', 'Venue', ...uniqueTourColumns.map(x => x.SetTourWeekDate), 'Last Week', ...(isSeatsDataRequired ? ['Sold', 'Capacity', 'vs Capacity'] : [])])
  worksheet.addRow([])

  for (let char = 'A', i = 0; i < columns.length; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
    worksheet.getColumn(char).width = 17
  }

  const groupBasedOnVenue: TKeyAndGroupBasedOnWeeksKeepingVenueCommonMapping = groupBasedOnVenueWeeksKeepingVenueCommon({ modifiedFetchedValues: finalFormattedValues })

  const totalForWeeks: WeekAggregates = headerWeekNums.reduce((acc, x) => ({ ...acc, [x]: [] }), {})
  let totalRowWeekWise: WeekAggregates = headerWeekNums.reduce((acc, x) => ({ ...acc, [x]: [] }), {})
  let totalCurrencyAndWeekWiseSeatsTotal: WeekAggregateSeatsDetail = Object.values(VENUE_CURRENCY_SYMBOLS).reduce((acc, symbol) => ({ ...acc, [symbol]: [] }), {})
  const totalCurrencyWiseSeatsTotal: WeekAggregateSeatsDetail = Object.values(VENUE_CURRENCY_SYMBOLS).reduce((acc, symbol) => ({ ...acc, [symbol]: [] }), {})

  const variableColsLength: number = headerWeekNums.length
  let row: number = 6

  let lastBookingWeek: string = finalFormattedValues?.[0]?.Week
  let seatsData: { Seats?: number, TotalCapacity?: number, Percentage?: string, Currency?: TRequiredFieldsFinalFormat['VenueCurrencySymbol'] } = {}
  Object.values(groupBasedOnVenue).forEach((rowAsJSON: TGroupBasedOnWeeksKeepingVenueCommon) => {
    // Adding Weekly Totals
    if (isWeeklyReport) {
      if (lastBookingWeek !== rowAsJSON.Week) {
        const rowsAdded: number = handleAddingWeeklyTotalRow({ worksheet, headerWeekNums, totalRowWeekWise, lastBookingWeek, totalCurrencyAndWeekWiseSeatsTotal, isSeatsDataRequired })
        makeTextBoldOfNRows({ worksheet, startingRow: row, numberOfRowsAdded: rowsAdded })
        row += rowsAdded
        totalRowWeekWise = headerWeekNums.reduce((acc, x) => ({ ...acc, [x]: [] }), {})
        lastBookingWeek = rowAsJSON.Week
        totalCurrencyAndWeekWiseSeatsTotal = Object.values(VENUE_CURRENCY_SYMBOLS).reduce((acc, symbol) => ({ ...acc, [symbol]: [] }), {})
      }
    }

    // Calculating Values
    const arr: any[] = getValuesFromObject(rowAsJSON, LEFT_PORTION_KEYS)
    const values: string[] = []
    for (let i = 0, col = 6; i < variableColsLength; i++, col++) {
      const key: string = getMapKeyForValue(rowAsJSON, { FormattedSetTourWeekNum: headerWeekNums[i], SetTourWeekDate: headerWeekDates[i] })
      const val: TRequiredFieldsFinalFormat = mapOfCreatedKeyAndModifiedFetchedValue[key]
      let totalObjToPush: Pick<TotalForSheet, 'Value' | 'ConversionRate' | 'VenueCurrencySymbol'> = { Value: 0, ConversionRate: 0, VenueCurrencySymbol: rowAsJSON.VenueCurrencySymbol }
      if (val) {
        values.push(val.FormattedValue)
        totalObjToPush = { Value: val.Value, ConversionRate: val.ConversionRate, VenueCurrencySymbol: val.VenueCurrencySymbol }
        if (isSeatsDataRequired) {
          seatsData = { Seats: parseInt(val.Seats as any as string), TotalCapacity: val.TotalCapacity, Percentage: (val.Seats === 0 || val.TotalCapacity === 0) ? '0.00%' : `${new Decimal(val.Seats).div(val.TotalCapacity).mul(100).toFixed(2)}%` }
          totalCurrencyAndWeekWiseSeatsTotal[val.VenueCurrencySymbol].push({ Seats: seatsData.Seats as number, TotalCapacity: seatsData.TotalCapacity as number, VenueCurrencySymbol: val.VenueCurrencySymbol })
          totalCurrencyWiseSeatsTotal[val.VenueCurrencySymbol].push({ Seats: seatsData.Seats as number, TotalCapacity: seatsData.TotalCapacity as number, VenueCurrencySymbol: val.VenueCurrencySymbol })
        }
      } else {
        if (moment(rowAsJSON.Date).valueOf() < moment(headerWeekDates[i]).valueOf()) {
          totalObjToPush = { Value: new Decimal(rowAsJSON.FormattedFinalFiguresValue.substring(1)) as any as number, ConversionRate: rowAsJSON.ConversionRate, VenueCurrencySymbol: rowAsJSON.VenueCurrencySymbol }
          values.push(rowAsJSON.FormattedFinalFiguresValue)
        } else {
          totalObjToPush = { Value: 0, ConversionRate: 0, VenueCurrencySymbol: rowAsJSON.VenueCurrencySymbol }
          values.push('')
        }
      }

      const finalValueToPushed: TotalForSheet = { ...totalObjToPush, ConvertedValue: new Decimal(totalObjToPush.Value).mul(totalObjToPush.ConversionRate) as any as number }
      totalForWeeks[headerWeekNums[i]].push(finalValueToPushed)
      totalRowWeekWise[headerWeekNums[i]].push(finalValueToPushed)
    }

    // Calculating Current Vs Prev Week Value
    const currVSPrevWeekValue: string = calculateCurrVSPrevWeekValue({ valuesArrayOnly: values })
    const rowData: string[] = [...arr, ...values, currVSPrevWeekValue, ...(seatsData?.Seats !== undefined ? [seatsData.Seats, seatsData.TotalCapacity, seatsData.Percentage] : [])]
    worksheet.addRow(rowData)

    // For Color Coding
    for (let i = 0, col = 6; i < variableColsLength; i++, col++) {
      const key: string = getMapKeyForValue(rowAsJSON, { FormattedSetTourWeekNum: headerWeekNums[i], SetTourWeekDate: headerWeekDates[i] })
      const val: TRequiredFieldsFinalFormat = mapOfCreatedKeyAndModifiedFetchedValue[key]
      if (val) {
        assignBackgroundColor({ worksheet, row, col, props: { SetIsCopy: val.SetIsCopy, SetBrochureReleased: val.SetBrochureReleased, BookingStatusCode: val.BookingStatusCode, Date: val.Date, SetTourWeekDate: headerWeekDates[i], NotOnSalesDate: rowAsJSON.NotOnSalesDate }, meta: { weekCols: variableColsLength + 1 } })
      } else {
        if (moment(rowAsJSON.Date).valueOf() < moment(headerWeekDates[i]).valueOf()) {
          colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.BLUE })
        }
        if (rowAsJSON.NotOnSalesDate && (moment(headerWeekDates[i]).valueOf() < moment(rowAsJSON.NotOnSalesDate).valueOf())) {
          colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.RED })
        }
      }
    }

    row++
  })

  // Filling Last Week wise totals
  if (isWeeklyReport) {
    const rowsAdded: number = handleAddingWeeklyTotalRow({ worksheet, headerWeekNums, totalRowWeekWise, lastBookingWeek, totalCurrencyAndWeekWiseSeatsTotal, isSeatsDataRequired })
    makeTextBoldOfNRows({ worksheet, startingRow: row, numberOfRowsAdded: rowsAdded })
    row += rowsAdded
  }

  // STYLINGS
  // Column Styling
  alignCellTextRight({ worksheet, colAsChar: 'C' })
  for (let char = 'F', i = 0; i <= (variableColsLength + (isSeatsDataRequired ? 3 : 0)); i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
    alignCellTextRight({ worksheet, colAsChar: char })
  }
  // Row Styling
  makeRowTextBold({ worksheet, row: 1 })
  makeRowTextBoldAndALignCenter({ worksheet, row: 3 })
  makeRowTextBoldAndALignCenter({ worksheet, row: 4 })
  worksheet.addRow([])
  row++

  // Add Euro Total Row
  const seatsDataForEuro: string[] = isSeatsDataRequired ? getSeatsColumnForWeekTotal({ currencySymbol: VENUE_CURRENCY_SYMBOLS.EURO, totalCurrencyWiseSeatsMapping: totalCurrencyWiseSeatsTotal }) : []
  const weekWiseDataInEuro = headerWeekNums.map(weekNum => getCurrencyWiseTotal({ totalForWeeks, setTourWeekNum: weekNum, currencySymbol: VENUE_CURRENCY_SYMBOLS.EURO }))
  worksheet.addRow(['', '', '', '', 'Total Sales €', ...weekWiseDataInEuro, getChangeVsLastWeekValue(weekWiseDataInEuro), ...seatsDataForEuro])
  row++
  // Add Pound Total Row
  const seatsDataForPound: string[] = isSeatsDataRequired ? getSeatsColumnForWeekTotal({ currencySymbol: VENUE_CURRENCY_SYMBOLS.POUND, totalCurrencyWiseSeatsMapping: totalCurrencyWiseSeatsTotal }) : []
  const weekWiseDataInPound = headerWeekNums.map(weekNum => getCurrencyWiseTotal({ totalForWeeks, setTourWeekNum: weekNum, currencySymbol: VENUE_CURRENCY_SYMBOLS.POUND }))
  worksheet.addRow(['', '', '', '', 'Total Sales £', ...weekWiseDataInPound, getChangeVsLastWeekValue(weekWiseDataInPound), ...seatsDataForPound])
  row++
  // Add empty row
  worksheet.addRow([])
  row++
  // Add Grand Total Row
  const seatsDataForTotal: string[] = isSeatsDataRequired ? getSeatsDataForTotal({ seatsDataForEuro, seatsDataForPound }) : []
  const weekWiseGrandTotalInPound = headerWeekNums.map(weekNum => getWeekWiseGrandTotalInPound({ totalForWeeks, setTourWeekNum: weekNum }))
  worksheet.addRow(['', '', '', '', 'Grand Total £', ...weekWiseGrandTotalInPound, getChangeVsLastWeekValue(weekWiseGrandTotalInPound), ...seatsDataForTotal])

  // Coloring this row
  for (let i = 0; i <= (variableColsLength + (isSeatsDataRequired ? 3 : 0)) + 1; i++) {
    colorCell({ worksheet, row, col: i + 5, argbColor: COLOR_HEXCODE.YELLOW })
    addCellBorder({ worksheet, row, col: i + 5, argbColor: COLOR_HEXCODE.YELLOW })
    makeCellTextBold({ worksheet, row, col: i + 5 })
  }
  row++

  makeColumnTextBold({ worksheet, colAsChar: 'A' })
  makeColumnTextBold({ worksheet, colAsChar: 'B' })
  makeColumnTextBold({ worksheet, colAsChar: 'C' })
  makeColumnTextBold({ worksheet, colAsChar: 'D' })
  makeColumnTextBold({ worksheet, colAsChar: 'E' })

  const totalColumns: number = worksheet.columnCount
  const lastColumn: number = 'A'.charCodeAt(totalColumns)
  worksheet.mergeCells(`A1:${String.fromCharCode(lastColumn)}1`)
  worksheet.getCell(1, 1).font = { size: 16, bold: true }
  const widths = ['D', 'E'].map((col) => {
    let maxLength = 0
    worksheet.getColumn(col).eachCell({ includeEmpty: true }, function (cell) {
      const columnLength = cell.value ? cell.value.toString().length : 10
      if (columnLength > maxLength) {
        maxLength = columnLength
      }
    })
    return maxLength
  })
  worksheet.getColumn('D').width = widths[0]
  worksheet.getColumn('E').width = widths[1]
  worksheet.getColumn('A').width = 9
  worksheet.getColumn('B').width = 11
  worksheet.getColumn('C').width = 10

  const filename = getFileName(worksheet)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="Sales Summary ${isWeeklyReport ? 'plus Weekly ' : ''} for ${filename}"`)

  workbook.xlsx.write(res).then(() => {
    res.end()
  })
}

export default handler
