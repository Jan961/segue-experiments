import prisma from 'lib/prisma';
import { TSalesView } from 'types/MarketingTypes';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { getCurrencyFromBookingId } from 'services/venueCurrencyService';

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
    const currencySymbol = (await getCurrencyFromBookingId(BookingId)) || '';

    // Fetch data using Prisma Client
    const data = await prisma.salesView.findMany({
      where: {
        BookingId,
        SaleTypeName: {
          not: '',
        },
      },
      orderBy: [{ BookingFirstDate: 'asc' }, { SetSalesFiguresDate: 'asc' }],
    });

    const groupedData = data.reduce((acc, sale) => {
      const key = getMapKey(sale);
      const val = acc[key];
      if (val) {
        return {
          ...acc,
          [key]: {
            ...val,
            ...(sale.SaleTypeName === 'General Sales' && {
              genSeatsSold: sale.Seats,
              venueCurrencySymbol: sale.VenueCurrencySymbol,
              genTotalValue: currencySymbol + sale.Value,
            }),
            ...(sale.SaleTypeName === 'General Reservations' && {
              genReserved: sale.Seats,
              genReservations: currencySymbol + sale.Value,
            }),
            ...(sale.SaleTypeName === 'School Sales' && {
              schSeatsSold: sale.Seats,
              venueCurrencySymbol: sale.VenueCurrencySymbol,
              schTotalValue: currencySymbol + sale.Value,
            }),
            ...(sale.SaleTypeName === 'School Reservations' && {
              schReserved: sale.Seats,
              schReservations: currencySymbol + sale.Value,
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
          ...(sale.SaleTypeName === 'General Sales' && {
            genSeatsSold: sale.Seats,
            genTotalValue: currencySymbol + sale.Value,
          }),
          ...(sale.SaleTypeName === 'General Reservations' && {
            genReserved: sale.Seats,
            genReservations: currencySymbol + sale.Value,
          }),
          ...(sale.SaleTypeName === 'School Sales' && {
            schSeatsSold: sale.Seats,
            venueCurrencySymbol: sale.VenueCurrencySymbol,
            schTotalValue: currencySymbol + sale.Value,
          }),
          ...(sale.SaleTypeName === 'School Reservations' && {
            schReserved: sale.Seats,
            schReservations: currencySymbol + sale.Value,
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
