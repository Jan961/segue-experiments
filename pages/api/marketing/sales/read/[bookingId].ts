import prisma from 'lib/prisma'
import { dateToSimple } from 'services/dateService'
import { TSalesView } from 'types/MarketingTypes'
import numeral from 'numeral'
import { getEmailFromReq, checkAccess } from 'services/userService'

const getMapKey = (
  { FullTourCode, TourStartDate, BookingFirstDate, BookingStatusCode, VenueTown, VenueCode, SetSalesFiguresDate, SetBookingWeekNum, SetTourWeekDate }: Pick<TSalesView, 'FullTourCode' | 'TourStartDate' | 'BookingFirstDate' | 'BookingStatusCode' | 'VenueTown' | 'VenueCode' | 'SetSalesFiguresDate' | 'SetBookingWeekNum' | 'SetTourWeekDate'>
): string => `${FullTourCode} | ${TourStartDate} | ${BookingFirstDate} | ${BookingStatusCode} | ${VenueTown} | ${VenueCode} | ${SetSalesFiguresDate} | ${SetBookingWeekNum} | ${SetTourWeekDate}`

export default async function handle (req, res) {
  try {
    const BookingId = parseInt(req.query.bookingId)

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { BookingId })
    console.log(access)
    if (!access) return res.status(401).end()

    const data = await prisma.$queryRaw`select * from SalesView where BookingId=${BookingId} order by BookingFirstDate, SetSalesFiguresDate`
    const groupedData = data.reduce((acc, sale) => {
      const key = getMapKey(sale)
      const val = acc[key]
      if (val) {
        return {
          ...acc,
          [key]: {
            ...val,
            ...(sale.SaleTypeName === 'General Sales' && {
              seatsSold: parseInt(sale.Seats),
              venueCurrencySymbol: sale.VenueCurrencySymbol,
              totalValue: parseFloat(sale.Value)
            }),
            ...(sale.SaleTypeName === 'General Reservations' && {
              reserved: sale.Seats,
              reservations: sale.Value ? numeral(sale.Value).format(sale.VenueCurrencySymbol + '0,0.00') : ''
            })
          }
        }
      }
      return {
        ...acc,
        [key]: {
          week: sale.SetBookingWeekNum ? `Week-${sale.SetBookingWeekNum}` : '',
          weekOf: dateToSimple(sale.SetSalesFiguresDate),
          seatsSold: parseInt(sale.Seats) || 0,
          seatsSalePercentage: (sale.Seats / sale.TotalCapacity) * 100,
          reservations: '',
          reserved: '',
          venueCurrencySymbol: sale.VenueCurrencySymbol,
          totalValue: parseFloat(sale.Value) || 0,
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
            seatsSold: parseInt(sale.Seats),
            totalValue: parseFloat(sale.Value)
          }),
          ...(sale.SaleTypeName === 'General Reservations' && {
            reserved: parseInt(sale.Seats),
            reservations: sale.Value ? numeral(sale.Value).format(sale.VenueCurrencySymbol + '0,0.00') : ''
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
