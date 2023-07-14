import ExcelJS from 'exceljs'
import prisma from 'lib/prisma'
import moment from 'moment'
import Decimal from 'decimal.js'

const COLOR_HEXCODE = {
  PURPLE: 'ff7030a0',
  BLUE: 'ff9bc2e6',
  YELLOW: 'ffffff00',
  GREY: 'ffc8c8c8',
  RED: 'ffff0000'
}

const formatWeek = (num) => `Week ${num}`
const getMapKey = (
  { Week, Town, Venue, SetTourWeekNum, SetTourWeekDate },
  { SetTourWeekNum: setTourWeekNumVar, SetTourWeekDate: setTourWeekDateVar } = {}
) => setTourWeekNumVar
  ? `${Week} | ${Town} | ${Venue} | ${setTourWeekNumVar} | ${setTourWeekDateVar}`
  : `${Week} | ${Town} | ${Venue} | ${SetTourWeekNum} | ${SetTourWeekDate}`

const getAggregateKey = (
  { Week, Town, Venue }
) => `${Week} | ${Town} | ${Venue}`

const leftPortionKeys = ['Week', 'Day', 'Date', 'Town', 'Venue']
const getValuesFromObject = (obj, array) => array.map(key => obj[key])

const CONSTANTS = { CHANGE_VS: 'Change VS' }

const assignBackgroundColor = ({ worksheet, row, col, props: { SetIsCopy, SetBrochureReleased, BookingStatusCode, Date, SetTourWeekDate, NotOnSalesDate }, meta: { weekCols } }) => {
  if (BookingStatusCode === 'X') {
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

const makeRowTextBold = ({ worksheet, row }) => {
  worksheet.getRow(row).eachCell((cell) => {
    cell.font = { bold: true }
  })
}

const makeRowTextBoldAndALignCenter = ({ worksheet, row }) => {
  worksheet.getRow(row).eachCell((cell) => {
    cell.font = { bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
  })
}

const alignCellTextRight = ({ worksheet, colAsChar }) => {
  worksheet.getColumn(colAsChar).eachCell((cell) => {
    cell.alignment = { horizontal: 'right' }
  })
}

const colorCell = ({ worksheet, row, col, argbColor }) => {
  worksheet.getCell(row, col).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: argbColor }
  }
}

const getUniqueAndSortedHeaderTourColumns = (finalFormattedValues) => {
  const tourColumns = Array.from(new Set(finalFormattedValues.map(({ SetTourWeekNum, SetTourWeekDate }) => ({ SetTourWeekNum, SetTourWeekDate }))))
  const uniqueTourColumns = tourColumns.reduce(({ keys, values }, x) => {
    const doesKeyExists = keys.includes(x.SetTourWeekNum)
    if (doesKeyExists) return { keys, values }
    return {
      keys: [...keys, x.SetTourWeekNum],
      values: [...values, x]
    }
  }, { keys: [], values: [] }).values

  uniqueTourColumns.sort((a, b) => {
    const t1 = Number(a.SetTourWeekNum.split(' ')[1])
    const t2 = Number(b.SetTourWeekNum.split(' ')[1])
    return t1 - t2
  })
  return uniqueTourColumns
}

const groupBasedOnVenueWeeksKeepingVenueCommon = ({ modifiedFetchedValues }) => modifiedFetchedValues.reduce((acc, obj) => {
  const key = getAggregateKey(obj)
  const val = acc[key]
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
            SetTourWeekNum: obj.SetTourWeekNum,
            SetTourWeekDate: obj.SetTourWeekDate,
            SetIsCopy: obj.SetIsCopy,
            SetBrochureReleased: obj.SetBrochureReleased
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
          SetTourWeekNum: obj.SetTourWeekNum,
          SetTourWeekDate: obj.SetTourWeekDate,
          SetIsCopy: obj.SetIsCopy,
          SetBrochureReleased: obj.SetBrochureReleased
        }
      ]
    }
  }
}, {})

const handleAddingWeeklyTotalRowForOneCurrencyOnly = ({ worksheet, headerWeekNums, totalRowWeekWise, currencySymbol, lastBookingWeek }) => {
  const weekWiseDataInEuro = headerWeekNums.map(weekNum => getCurrencyWiseTotal({ totalForWeeks: totalRowWeekWise, setTourWeekNum: weekNum, currencySymbol }))
  const rowData = ['', '', '', '', `Tour ${lastBookingWeek}`, ...weekWiseDataInEuro, getChangeVsLastWeekValue(weekWiseDataInEuro)]
  if (rowData.slice(5, rowData.length).filter(x => x != `${currencySymbol}0`)?.length) {
    worksheet.addRow(rowData)
    return {
      numberOfRowsAdded: 1
    }
  }
  return {
    numberOfRowsAdded: 0
  }
}

const handleAddingWeeklyTotalRow = ({ worksheet, headerWeekNums, totalRowWeekWise, lastBookingWeek }) => {
  const rowsAdded = ['€', '£'].reduce((acc, currencySymbol) => acc + handleAddingWeeklyTotalRowForOneCurrencyOnly({ worksheet, headerWeekNums, totalRowWeekWise, currencySymbol, lastBookingWeek }).numberOfRowsAdded, 0)
  return rowsAdded
}

const calculateCurrVSPrevWeekValue = ({ valuesArrayOnly }) => {
  if (valuesArrayOnly?.length == 1) {
    return valuesArrayOnly[0]
  } else {
    const len = valuesArrayOnly.length

    if (valuesArrayOnly[len - 2] || valuesArrayOnly[len - 1]) {
      const prev = valuesArrayOnly[len - 2] ? valuesArrayOnly[len - 2].substring(1) : 0
      const curr = valuesArrayOnly[len - 1] ? valuesArrayOnly[len - 1].substring(1) : 0
      const val = new Decimal(curr).minus(prev).toFixed(2)
      const symbol = valuesArrayOnly[len - 2] ? valuesArrayOnly[len - 2].substring(0, 1) : valuesArrayOnly[len - 1].substring(0, 1)
      const prefix = val >= 0 ? `${symbol}` : `-${symbol}`
      return `${prefix}${val > 0 ? val : -1 * val}`
    } else {
      // Nothing in this condition
    }
  }
  return null
}

const makeTextBoldOfNRows = ({ worksheet, startingRow, numberOfRowsAdded }) => {
  for (let i = 0; i < numberOfRowsAdded; i++) {
    makeRowTextBold({ worksheet, row: startingRow + i })
  }
}

const getFileName = (worksheet) => `${worksheet.getCell(1, 1).value} ${moment().format('DD MM YYYY hh:mm:ss')}.xlsx`

const getCurrencyWiseTotal = ({ totalForWeeks, setTourWeekNum, currencySymbol }) => {
  const arr = totalForWeeks[setTourWeekNum]

  if (!arr?.length) {
    return `${currencySymbol}0`
  }

  const finalValue = arr.filter(x => x.VenueCurrencySymbol === currencySymbol).map(x => x.Value).reduce((acc, x) => new Decimal(acc).plus(x), 0)
  return `${currencySymbol}${finalValue}`
}

const getChangeVsLastWeekValue = (weeksDataArray) => {
  if (weeksDataArray?.length == 1) {
    return weeksDataArray[0]
  } else {
    const len = weeksDataArray.length

    if (weeksDataArray[len - 2] || weeksDataArray[len - 1]) {
      const prev = weeksDataArray[len - 2] ? weeksDataArray[len - 2].substring(1) : 0
      const curr = weeksDataArray[len - 1] ? weeksDataArray[len - 1].substring(1) : 0
      const val = new Decimal(curr).minus(prev).toFixed(2)
      const symbol = weeksDataArray[len - 2] ? weeksDataArray[len - 2].substring(0, 1) : weeksDataArray[len - 1].substring(0, 1)
      const prefix = val >= 0 ? `${symbol}` : `-${symbol}`
      return `${prefix}${val > 0 ? val : -1 * val}`
    } else {
      // This case should not occur
    }
  }
}

const getWeekWiseGrandTotalInPound = ({ totalForWeeks, setTourWeekNum }) => {
  const arr = totalForWeeks[setTourWeekNum]

  if (!arr?.length) {
    return '£0'
  }

  const finalValue = arr.map(x => x.ConvertedValue).reduce((acc, x) => new Decimal(acc).plus(x), 0)
  return `£${finalValue}`
}

const handler = async (req, res) => {
  const { tourId, fromWeek, toWeek, isWeeklyReport } = JSON.parse(req.body) || {}
  const workbook = new ExcelJS.Workbook()

  console.log(`select * FROM SalesView where  TourId = ${parseInt(tourId)} AND setTourWeekDate between ${fromWeek} and ${toWeek} order by BookingFirstDate, SetSalesFiguresDate;`)
  const data = await prisma.$queryRaw`select * FROM SalesView where  TourId = ${parseInt(tourId)} AND setTourWeekDate between ${fromWeek} and ${toWeek} order by BookingFirstDate, SetSalesFiguresDate;`
  const jsonArray = data.filter(x => x.SaleTypeName === "General Sales").map(({ BookingTourWeekNum, BookingFirstDate, VenueTown, VenueName, Value, VenueCurrencySymbol, SetTourWeekNum, SetTourWeekDate, ConversionRate, SetIsCopy, SetBrochureReleased, BookingStatusCode, FinalFiguresValue, TotalCapacity, Seats, NotOnSalesDate }) => ({ Week: BookingTourWeekNum, Day: moment(BookingFirstDate).format('dddd'), Date: BookingFirstDate, Town: VenueTown, Venue: VenueName, Value, VenueCurrencySymbol, SetTourWeekNum, SetTourWeekDate, ConversionRate, SetIsCopy, SetBrochureReleased, BookingStatusCode, FinalFiguresValue, TotalCapacity, Seats, NotOnSalesDate }))
  const finalFormattedValues = jsonArray.map((x) => ({ ...x, Week: formatWeek(x.Week), FormattedValue: x.Value ? `${x.VenueCurrencySymbol}${x.Value}` : '', Value: x.Value || 0, SetTourWeekNum: formatWeek(x.SetTourWeekNum), FormattedFinalFiguresValue: x.FinalFiguresValue ? `${x.VenueCurrencySymbol}${x.FinalFiguresValue}` : '' }))

  // Write data to the worksheet
  const worksheet = workbook.addWorksheet('My Sales', {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 }
  })

  const mapOfCreatedKeyAndModifiedFetchedValue = finalFormattedValues.reduce((acc, x) => ({
    ...acc,
    [getMapKey(x)]: x
  }), {})

  // Logic for headers
  const uniqueTourColumns = getUniqueAndSortedHeaderTourColumns(finalFormattedValues)
  const headerWeekNums = uniqueTourColumns.map(x => x.SetTourWeekNum)
  const headerWeekDates = uniqueTourColumns.map(x => x.SetTourWeekDate)

  // Adding Heading
  worksheet.getCell(1, 1).value = data?.length ? data[0].ShowName + ' (' + data[0].FullTourCode + ')' : 'Dummy Report'
  worksheet.getCell(1, 1).font = { size: 24 }
  worksheet.addRow([])

  // Adding Table Columns
  const columns = ['Tour', '', '', '', '', ...uniqueTourColumns.map(x => x.SetTourWeekNum), CONSTANTS.CHANGE_VS]
  worksheet.addRow(columns)
  worksheet.addRow(['Week', 'Day', 'Date', 'Town', 'Venue', ...uniqueTourColumns.map(x => x.SetTourWeekDate), 'Last Week'])
  worksheet.addRow([])

  // Adjust columns width
  for (let char = 'A', i = 0; i < columns.length; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
    worksheet.getColumn(char).width = 17
  }
  const groupBasedOnVenue = groupBasedOnVenueWeeksKeepingVenueCommon({ modifiedFetchedValues: finalFormattedValues })

  const totalForWeeks = headerWeekNums.reduce((acc, x) => ({ ...acc, [x]: [] }), {})
  let totalRowWeekWise = headerWeekNums.reduce((acc, x) => ({ ...acc, [x]: [] }), {})

  const variableColsLength = headerWeekNums.length
  let row = 6

  let lastBookingWeek = finalFormattedValues?.[0]?.Week
  Object.values(groupBasedOnVenue).forEach(json => {
    // Adding Weekly Totals
    if (isWeeklyReport) {
      if (lastBookingWeek != json.Week) {
        const rowsAdded = handleAddingWeeklyTotalRow({ worksheet, headerWeekNums, totalRowWeekWise, lastBookingWeek })
        makeTextBoldOfNRows({ worksheet, startingRow: row, numberOfRowsAdded: rowsAdded })
        row += rowsAdded
        totalRowWeekWise = headerWeekNums.reduce((acc, x) => ({ ...acc, [x]: [] }), {})
        lastBookingWeek = json.Week
      }
    }

    // Calculating Values
    const arr = getValuesFromObject(json, leftPortionKeys)
    const values = []
    for (let i = 0, col = 6; i < variableColsLength; i++, col++) {
      const key = getMapKey(json, { SetTourWeekNum: headerWeekNums[i], SetTourWeekDate: headerWeekDates[i] })
      const val = mapOfCreatedKeyAndModifiedFetchedValue[key]
      let totalObjToPush = {}
      if (val) {
        values.push(val.FormattedValue)
        totalObjToPush = { Value: val.Value, ConversionRate: val.ConversionRate, VenueCurrencySymbol: val.VenueCurrencySymbol }
      } else {
        if (moment(json.Date).valueOf() < moment(headerWeekDates[i]).valueOf()) {
          totalObjToPush = { Value: json.FormattedFinalFiguresValue.substring(1), ConversionRate: json.ConversionRate, VenueCurrencySymbol: json.VenueCurrencySymbol }
          values.push(json.FormattedFinalFiguresValue)
        } else {
          totalObjToPush = { Value: 0, ConversionRate: 0, VenueCurrencySymbol: json.VenueCurrencySymbol }
          values.push('')
        }
      }

      const finalValueToPushed = { ...totalObjToPush, ConvertedValue: new Decimal(totalObjToPush.Value).mul(totalObjToPush.ConversionRate) }
      totalForWeeks[headerWeekNums[i]].push(finalValueToPushed)
      totalRowWeekWise[headerWeekNums[i]].push(finalValueToPushed)
    }

    // Calculating Current Vs Prev Week Value
    const currVSPrevWeekValue = calculateCurrVSPrevWeekValue({ valuesArrayOnly: values })
    const rowData = currVSPrevWeekValue ? [...arr, ...values, currVSPrevWeekValue] : [...arr, ...values]
    worksheet.addRow(rowData)

    // For Color Coding
    for (let i = 0, col = 6; i < variableColsLength; i++, col++) {
      const key = getMapKey(json, { SetTourWeekNum: headerWeekNums[i], SetTourWeekDate: headerWeekDates[i] })
      const val = mapOfCreatedKeyAndModifiedFetchedValue[key]
      if (val) {
        assignBackgroundColor({ worksheet, row, col, props: { SetIsCopy: val.SetIsCopy, SetBrochureReleased: val.SetBrochureReleased, BookingStatusCode: val.BookingStatusCode, Date: val.Date, SetTourWeekDate: headerWeekDates[i], NotOnSalesDate: json.NotOnSalesDate }, meta: { weekCols: variableColsLength + 1 } })
      } else {
        if (moment(json.Date).valueOf() < moment(headerWeekDates[i]).valueOf()) {
          colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.BLUE })
        }
        if (json.NotOnSalesDate && (moment(headerWeekDates[i]).valueOf() < moment(json.NotOnSalesDate).valueOf())) {
          colorCell({ worksheet, row, col, argbColor: COLOR_HEXCODE.RED })
        }
      }
    }

    row++
  })

  // Filling Last Week wise totals
  if (isWeeklyReport) {
    const rowsAdded = handleAddingWeeklyTotalRow({ worksheet, headerWeekNums, totalRowWeekWise, lastBookingWeek })
    // makeTextBoldOfNRows({ worksheet, startingRow: row, numberOfRowsAdded: rowsAdded });
    row += rowsAdded
  }

  // STYLINGS
  // Column Styling
  alignCellTextRight({ worksheet, colAsChar: 'C' })
  for (let char = 'F', i = 0; i <= variableColsLength; i++, char = String.fromCharCode(char.charCodeAt(0) + 1)) {
    alignCellTextRight({ worksheet, colAsChar: char })
  }
  // Row Styling
  makeRowTextBold({ worksheet, row: 1 })
  makeRowTextBoldAndALignCenter({ worksheet, row: 3 })
  makeRowTextBoldAndALignCenter({ worksheet, row: 4 })
  worksheet.addRow([])
  row++

  // Add Euro Total Row
  const weekWiseDataInEuro = headerWeekNums.map(weekNum => getCurrencyWiseTotal({ totalForWeeks, setTourWeekNum: weekNum, currencySymbol: '€' }))
  worksheet.addRow(['', '', '', '', 'Total Sales €', ...weekWiseDataInEuro, getChangeVsLastWeekValue(weekWiseDataInEuro)])
  row++
  // Add Pound Total Row
  const weekWiseDataInPound = headerWeekNums.map(weekNum => getCurrencyWiseTotal({ totalForWeeks, setTourWeekNum: weekNum, currencySymbol: '£' }))
  worksheet.addRow(['', '', '', '', 'Total Sales £', ...weekWiseDataInPound, getChangeVsLastWeekValue(weekWiseDataInPound)])
  row++
  // Add empty row
  worksheet.addRow([])
  row++
  // Add Grand Total Row
  const weekWiseGrandTotalInPound = headerWeekNums.map(weekNum => getWeekWiseGrandTotalInPound({ totalForWeeks, setTourWeekNum: weekNum }))
  worksheet.addRow(['', '', '', '', 'Grand Total £', ...weekWiseGrandTotalInPound, getChangeVsLastWeekValue(weekWiseGrandTotalInPound)])
  // Coloring this row
  for (let i = 0; i <= variableColsLength + 1; i++) {
    colorCell({ worksheet, row, col: i + 5, argbColor: COLOR_HEXCODE.YELLOW })
  }
  row++

  const filename = getFileName(worksheet)
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

  workbook.xlsx.write(res).then(() => {
    res.end()
  })
}

export default handler
