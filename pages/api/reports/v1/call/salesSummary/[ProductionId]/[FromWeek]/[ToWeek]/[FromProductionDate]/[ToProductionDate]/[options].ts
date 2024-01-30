import ExcelJS from 'exceljs';
import prisma from 'lib/prisma';

export default async function handle(req, res) {
  const { type } = req.query;
  return HANDLERS_MAPPER[type](req, res);
}

// Production: "11"
// ProductionWeek: "2023-11-06T00:00:00.000Z"
// numberOfWeeks: "6"
// order: "change"
// productionEndDate: "2023-11-26T00:00:00.000Z"
// productionStartDate: "2023-10-02T00:00:00.000Z"

/**
--- VenueCurrency		VenueCurrencySymbol
--- ProductionWeekNum			BookingProductionWeekNum
--- WeekDate
--- RunSeatsSold
--- TotalSeats
*/

/**
   {
    ShowName: 'Menopause the Musical',
    ProductionId: 1,
    FullProductionCode: 'MTM22',
    ProductionStartDate: 2022-02-14T00:00:00.000Z,
    ProductionEndDate: 2022-06-19T00:00:00.000Z,
    BookingFirstDate: 2022-05-01T00:00:00.000Z,
    BookingStatusCode: 'C',
    BookingProductionWeekNum: 11,
    VenueTown: 'Castlebar',
    VenueCode: 'CASROY',
    VenueName: 'Royal Theatre, Castlebar',
    VenueCurrencyCode: 'EUR',
    VenueCurrencySymbol: '€',
    ConversionToCurrencyCode: 'GBP',
    ConversionRate: 0.865,
    SetSalesFiguresDate: 2021-11-01T00:00:00.000Z,
    SetProductionWeekNum: -25,
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
  const {
    production: ProductionId,
    fromWeek,
    toWeek,
    productionEndDate: ToProductionDate,
    productionStartDate: FromProductionDate,
    ShowName,
  } = JSON.parse(req.body);
  const result = await prisma.$queryRaw`SELECT * FROM SalesView WHERE ProductionId = ${parseInt(ProductionId)}
  AND BookingFirstDate BETWEEN ${FromProductionDate} AND ${ToProductionDate}
  AND SetSalesFiguresDate BETWEEN ${fromWeek} AND ${toWeek}`;

  // console.log(result)
  const workbook = new ExcelJS.Workbook();
  // const josnArray = data.map(({ WeekName, WeekDate, Town, VenueName }) => ({ Week: WeekName, Day: 1, Date: WeekDate, Town, Venue: VenueName }))
  const josnArray = result.map(({ SetProductionWeekNum, SetSalesFiguresDate, VenueTown, VenueName }) => ({
    Week: SetProductionWeekNum,
    Day: 1,
    Date: SetSalesFiguresDate,
    Town: VenueTown,
    Venue: VenueName,
  }));
  // Write data to the worksheet
  const worksheet = workbook.addWorksheet('My Sales', {
    pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 },
  });

  console.log('ShowName', ShowName);
  worksheet.getCell(1, 1).value = ShowName || 'Reports';
  worksheet.addRow([]);
  worksheet.addRow(['Production']);

  worksheet.addRow(['Week', 'Day', 'Date', 'Town', 'Venue']);
  josnArray.forEach((json) => {
    worksheet.addRow([...Object.values(json)]);
  });
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  const filename = `report_${new Date().getTime()}.xlsx`;

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  return workbook.xlsx.write(res).then(() => {
    res.end();
  });
};

const HANDLERS_MAPPER = {
  1: salesSummarySimple,
};
