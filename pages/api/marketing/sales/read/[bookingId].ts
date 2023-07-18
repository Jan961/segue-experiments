import prisma from 'lib/prisma'
import { dateToSimple } from 'services/dateService'

export default async function handle (req, res) {
  try {
    const bookingId = parseInt(req.query.bookingId)
    const data = await prisma.$queryRaw`select * from SalesView where BookingId=${bookingId} order by BookingFirstDate, SetSalesFiguresDate`
    const sales = data.map(sale => ({
      week: sale.SetTourWeekNum ? `Week-${sale.SetTourWeekNum}` : '',
      weekOf: dateToSimple(sale.SetSalesFiguresDate),
      seatsSold: sale.Seats,
      seatsSalePercentage: (sale.Seats / sale.TotalCapacity) * 100,
      reservations: '',
      reserved: '',
      totalValue: sale.Value ? `${sale.VenueCurrencySymbol} ${sale.Value}` : '',
      valueChange: '',
      totalHolds: sale.TotalHoldSeats,
      seatsChange: '',
      isCopy: sale.SetIsCopy,
      isBrochureReleased: sale.SetBrochureReleased,
      isSingleSeats: sale.SetSingleSeats,
      isNotOnSale: sale.SetNotOnSale,
      saleType: sale.SaleTypeName
    }))
    res.json(sales)
  } catch (err) {
    console.log(err)
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
