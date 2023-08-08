import ExcelJS from 'exceljs'
import prisma from 'lib/prisma'

export default async function handle (req, res) {
  const { type } = req.query
  return HANDLERS_MAPPER[type](req, res)
}

// Tour: "11"
// TourWeek: "2023-11-06T00:00:00.000Z"
// numberOfWeeks: "6"
// order: "change"
// tourEndDate: "2023-11-26T00:00:00.000Z"
// tourStartDate: "2023-10-02T00:00:00.000Z"

/**
--- VenueCurrency		VenueCurrencySymbol
--- TourWeekNum			BookingTourWeekNum
--- WeekDate
--- RunSeatsSold
--- TotalSeats
*/

/**
   {
    ShowName: 'Menopause the Musical',
    TourId: 1,
    FullTourCode: 'MTM22',
    TourStartDate: 2022-02-14T00:00:00.000Z,
    TourEndDate: 2022-06-19T00:00:00.000Z,
    BookingFirstDate: 2022-05-01T00:00:00.000Z,
    BookingStatusCode: 'C',
    BookingTourWeekNum: 11,
    VenueTown: 'Castlebar',
    VenueCode: 'CASROY',
    VenueName: 'Royal Theatre, Castlebar',
    VenueCurrencyCode: 'EUR',
    VenueCurrencySymbol: '€',
    ConversionToCurrencyCode: 'GBP',
    ConversionRate: 0.865,
    SetSalesFiguresDate: 2021-11-01T00:00:00.000Z,
    SetTourWeekNum: -25,
    SetNotOnSale: false,
    SetIsFinalFigures: false,
    SetSingleSeats: false,
    SetBrochureReleased: false,
    SetIsCopy: false,
    SaleTypeName: 'General Sales',
    Seats: 89,
    Value: 3115
  }
 */
const salesSummarySimple = async (req, res) => {
  const { tour: TourId, TourWeek, numberOfWeeks, order, fromWeek, toWeek, tourEndDate: ToTourDate, tourStartDate: FromTourDate, ShowName } = JSON.parse(req.body)
  // const result = await prisma.$queryRaw`
  //   SELECT  VenueCurrencySymbol, ConversionRate, TourWeekNum, WeekDate, SUM(Value) AS Total, SUM(RunSeatsSold) AS TotalRunSeatsSold, SUM(TotalSeats) AS TotalTotalSeats
  //   FROM SalesView
  //   WHERE \`TourId\` = ${TourId} AND \`ShowDate\` >= ${FromTourDate}  AND \`WeekDate\` BETWEEN ${FromWeek} AND ${ToWeek}  AND (IsNull(${FromTourDate})
  //       Or (ShowDate >= ${FromTourDate})) AND (IsNull(${ToTourDate}) Or (ShowDate <= ${ToTourDate}))
  //   GROUP BY TourWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate
  //   ORDER BY TourWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate`

  const result = await prisma.$queryRaw`SELECT * FROM SalesView WHERE TourId = ${parseInt(TourId)}
  AND BookingFirstDate BETWEEN ${FromTourDate} AND ${ToTourDate}
  AND SetSalesFiguresDate BETWEEN ${fromWeek} AND ${toWeek}`

  // console.log(result)
  const workbook = new ExcelJS.Workbook()
  // const josnArray = data.map(({ WeekName, WeekDate, Town, VenueName }) => ({ Week: WeekName, Day: 1, Date: WeekDate, Town, Venue: VenueName }))
  const josnArray = result.map(({ SetTourWeekNum, SetSalesFiguresDate, VenueTown, VenueName }) => ({ Week: SetTourWeekNum, Day: 1, Date: SetSalesFiguresDate, Town: VenueTown, Venue: VenueName }))
  // Write data to the worksheet
  const worksheet = workbook.addWorksheet('My Sales', {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 }
  })

  console.log('ShowName', ShowName)
  worksheet.getCell(1, 1).value = ShowName || 'Reports'
  worksheet.addRow([])
  worksheet.addRow(['Tour'])

  worksheet.addRow(['Week', 'Day', 'Date', 'Town', 'Venue'])
  let count = 1
  josnArray.forEach(json => {
    worksheet.addRow([...Object.values(json)])
    count += 1
  })
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true }
  })

  const filename = `report_${new Date().getTime()}.xlsx`

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)

  return workbook.xlsx.write(res).then(() => {
    res.end()
  })
}

const HANDLERS_MAPPER = {
  1: salesSummarySimple
}
