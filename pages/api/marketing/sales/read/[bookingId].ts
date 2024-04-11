import prisma from 'lib/prisma';
import { TSalesView } from 'types/MarketingTypes';
import numeral from 'numeral';
import { getEmailFromReq, checkAccess } from 'services/userService';

const getMapKey = ({
  FullProductionCode,
  ProductionStartDate,
  BookingFirstDate,
  BookingStatusCode,
  VenueTown,
  VenueCode,
  SetSalesFiguresDate,
  SetBookingWeekNum,
  SetProductionWeekDate,
}: Pick<
  TSalesView,
  | 'FullProductionCode'
  | 'ProductionStartDate'
  | 'BookingFirstDate'
  | 'BookingStatusCode'
  | 'VenueTown'
  | 'VenueCode'
  | 'SetSalesFiguresDate'
  | 'SetBookingWeekNum'
  | 'SetProductionWeekDate'
>): string =>
  `${FullProductionCode} | ${ProductionStartDate} | ${BookingFirstDate} | ${BookingStatusCode} | ${VenueTown} | ${VenueCode} | ${SetSalesFiguresDate} | ${SetBookingWeekNum} | ${SetProductionWeekDate}`;

export default async function handle(req, res) {
  try {
    const BookingId = parseInt(req.query.bookingId);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { BookingId });
    if (!access) return res.status(401).end();

    const data =
      await prisma.$queryRaw`select * from SalesView where BookingId=${BookingId} order by BookingFirstDate, SetSalesFiguresDate`;
    const groupedData = data.reduce((acc, sale) => {
      const key = getMapKey(sale);
      const val = acc[key];
      if (val) {
        return {
          ...acc,
          [key]: {
            ...val,
            ...(sale.SaleTypeName === 'General Sales' && {
              genSeatsSold: parseInt(sale.Seats),
              venueCurrencySymbol: sale.VenueCurrencySymbol,
              genTotalValue: parseFloat(sale.Value),
              saleType: 'general',
            }),
            ...(sale.SaleTypeName === 'General Reservations' && {
              genReserved: sale.Seats,
              genReservations: sale.Value ? numeral(sale.Value).format(sale.VenueCurrencySymbol + '0,0.00') : '',
              saleType: 'general',
            }),
            ...(sale.SaleTypeName === 'School Sales' && {
              schSeatsSold: parseInt(sale.Seats),
              venueCurrencySymbol: sale.VenueCurrencySymbol,
              schTotalValue: parseFloat(sale.Value),
              saleType: 'school',
            }),
            ...(sale.SaleTypeName === 'School Reservations' && {
              schReserved: sale.Seats,
              schReservations: sale.Value ? numeral(sale.Value).format(sale.VenueCurrencySymbol + '0,0.00') : '',
              saleType: 'school',
            }),
          },
        };
      }

      return {
        ...acc,
        [key]: {
          week: sale.SetBookingWeekNum ? `Week ${sale.SetBookingWeekNum}` : '',
          weekOf: sale.SetSalesFiguresDate,
          schSeatsSold: '',
          genSeatsSold: '',
          seatsSaleChange: '',
          schReservations: '',
          genReservations: '',
          schReserved: '',
          genReserved: '',
          venueCurrencySymbol: sale.VenueCurrencySymbol,
          schTotalValue: '',
          genTotalValue: '',
          valueChange: '',
          totalHolds: sale.TotalHoldSeats,
          seatsChange: '',
          isCopy: sale.SetIsCopy,
          isBrochureReleased: sale.SetBrochureReleased,
          isSingleSeats: sale.SetSingleSeats,
          isNotOnSale: sale.SetNotOnSale,
          capacity: sale.TotalCapacity,
          isFinal: sale.SetIsFinalFigures,
          notOnSaleDate: sale.NotOnSaleDate,
          saleType: '',
          ...(sale.SaleTypeName === 'General Sales' && {
            genSeatsSold: parseInt(sale.Seats),
            genTotalValue: parseFloat(sale.Value),
            saleType: 'general',
          }),
          ...(sale.SaleTypeName === 'General Reservations' && {
            genReserved: parseInt(sale.Seats),
            genReservations: sale.Value ? numeral(sale.Value).format(sale.VenueCurrencySymbol + '0,0.00') : '',
            saleType: 'general',
          }),
          ...(sale.SaleTypeName === 'School Sales' && {
            schSeatsSold: parseInt(sale.Seats),
            venueCurrencySymbol: sale.VenueCurrencySymbol,
            schTotalValue: parseFloat(sale.Value),
            saleType: 'school',
          }),
          ...(sale.SaleTypeName === 'School Reservations' && {
            schReserved: sale.Seats,
            schReservations: sale.Value ? numeral(sale.Value).format(sale.VenueCurrencySymbol + '0,0.00') : '',
            saleType: 'school',
          }),
        },
      };
    }, {});

    res.json(Object.values(groupedData));
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}
