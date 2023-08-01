import prisma from 'lib/prisma'
import { dateToSimple } from 'services/dateService'
import { TSalesView } from 'types/MarketingTypes'

const getMapKey = (
  { FullTourCode, TourStartDate, BookingFirstDate, BookingStatusCode, VenueTown, VenueCode, SetSalesFiguresDate, SetTourWeekNum, SetTourWeekDate }: Pick<TSalesView, 'FullTourCode' | 'TourStartDate' | 'BookingFirstDate' | 'BookingStatusCode' | 'VenueTown' | 'VenueCode' | 'SetSalesFiguresDate' | 'SetTourWeekNum' | 'SetTourWeekDate'>
): string => `${FullTourCode} | ${TourStartDate} | ${BookingFirstDate} | ${BookingStatusCode} | ${VenueTown} | ${VenueCode} | ${SetSalesFiguresDate} | ${SetTourWeekNum} | ${SetTourWeekDate}`

export default async function handle (req, res) {
  try {
    const bookingId = parseInt(req.query.bookingId)
    const data = await prisma.$queryRaw`select * from SalesView where BookingId=${bookingId} order by BookingFirstDate, SetSalesFiguresDate`
    const groupedData = data.reduce((acc, sale) => {
      const key = getMapKey(sale)
      const val = acc[key]
      if (val) {
        return {
          ...acc,
          [key]: {
            ...val,
            ...(sale.SaleTypeName === 'General Sales' && {
              seatsSold: sale.Seats,
              totalValue: sale.Value ? `${sale.VenueCurrencySymbol} ${sale.Value}` : ''
            }),
            ...(sale.SaleTypeName === 'General Reservations' && {
              reserved: sale.Seats,
              reservations: sale.Value ? `${sale.VenueCurrencySymbol} ${sale.Value}` : ''
            })
          }
        }
      }
      return {
        ...acc,
        [key]: {
          week: sale.SetTourWeekNum ? `Week-${sale.SetTourWeekNum}` : '',
          weekOf: dateToSimple(sale.SetSalesFiguresDate),
          seatsSold: sale.Seats || 0,
          seatsSalePercentage: (sale.Seats / sale.TotalCapacity) * 100,
          reservations: '',
          reserved: '',
          VenueCurrencySymbol: sale.VenueCurrencySymbol,
          totalValue: sale.Value || 0,
          valueChange: '',
          totalHolds: sale.TotalHoldSeats,
          seatsChange: '',
          isCopy: sale.SetIsCopy,
          isBrochureReleased: sale.SetBrochureReleased,
          isSingleSeats: sale.SetSingleSeats,
          isNotOnSale: sale.SetNotOnSale,
          capacity: sale.TotalCapacity,
          // saleType: sale.SaleTypeName,
          ...(sale.SaleTypeName === 'General Sales' && {
            seatsSold: sale.Seats,
            totalValue: sale.Value ? `${sale.VenueCurrencySymbol} ${sale.Value}` : ''
          }),
          ...(sale.SaleTypeName === 'General Reservations' && {
            reserved: sale.Seats,
            reservations: sale.Value ? `${sale.VenueCurrencySymbol} ${sale.Value}` : ''
          })
        }
      }
    }, {})
    res.json(Object.values(groupedData))
  } catch (err) {
    console.log(err)
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
