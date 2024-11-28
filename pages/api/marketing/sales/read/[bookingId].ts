import getPrismaClient from 'lib/prisma';
import { TSalesView } from 'types/MarketingTypes';
import { getCurrencyFromBookingId } from 'services/venueCurrencyService';
import { BOOK_STATUS_CODES } from 'types/SalesSummaryTypes';
import { formatDate } from 'services/dateService';
import { UTCDate } from '@date-fns/utc';

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
    const prisma = await getPrismaClient(req);
    const BookingId = parseInt(req.query.bookingId);
    const currencySymbol = (await getCurrencyFromBookingId(req, BookingId)) || '';

    // Fetch data using Prisma Client
    const data = await prisma.salesView
      .findMany({
        where: {
          BookingId,
          SaleTypeName: {
            not: '',
          },
        },
        orderBy: [{ BookingFirstDate: 'asc' }, { SetSalesFiguresDate: 'asc' }],
      })
      .then((res) =>
        res.map((x) => ({
          ...x,
          ProductionStartDate: new UTCDate(x.ProductionStartDate),
          BookingFirstDate: new UTCDate(x.BookingFirstDate),
          SetSalesFiguresDate: new UTCDate(x.SetSalesFiguresDate),
          SetProductionWeekDate: new UTCDate(x.SetProductionWeekDate),
        })),
      );

    const groupedData = data.reduce((acc, sale) => {
      const formattedSale = {
        ...sale,
        ProductionStartDate: formatDate(sale.ProductionStartDate, 'yyyy-MM-dd'),
        BookingFirstDate: formatDate(sale.BookingFirstDate, 'yyyy-MM-dd'),
        SetSalesFiguresDate: formatDate(sale.SetSalesFiguresDate, 'yyyy-MM-dd'),
        SetProductionWeekDate: formatDate(sale.SetProductionWeekDate, 'yyyy-MM-dd'),
        BookingStatusCode: BOOK_STATUS_CODES[sale.BookingStatusCode],
      };
      const key = getMapKey(formattedSale);
      const val = acc[key];
      if (val) {
        return {
          ...acc,
          [key]: {
            ...val,
            ...(sale.SaleTypeName === 'General Sales' && {
              genSeatsSold: sale.Seats,
              venueCurrencySymbol: sale.VenueCurrencySymbolUnicode,
              genTotalValue: currencySymbol + sale.Value,
            }),
            ...(sale.SaleTypeName === 'General Reservations' && {
              genReserved: sale.Seats,
              genReservations: currencySymbol + sale.Value,
            }),
            ...(sale.SaleTypeName === 'School Sales' && {
              schSeatsSold: sale.Seats,
              venueCurrencySymbol: sale.VenueCurrencySymbolUnicode,
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
          venueCurrencySymbol: sale.VenueCurrencySymbolUnicode,
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
            venueCurrencySymbol: sale.VenueCurrencySymbolUnicode,
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
