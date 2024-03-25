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
    console.log(access);
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
              seatsSold: parseInt(sale.Seats),
              venueCurrencySymbol: sale.VenueCurrencySymbol,
              totalValue: parseFloat(sale.Value),
            }),
            ...(sale.SaleTypeName === 'General Reservations' && {
              reserved: sale.Seats,
              reservations: sale.Value ? numeral(sale.Value).format(sale.VenueCurrencySymbol + '0,0.00') : '',
            }),
          },
        };
      }

      return {
        ...acc,
        [key]: {
          week: sale.SetBookingWeekNum ? `Week-${sale.SetBookingWeekNum}` : '',
          weekOf: sale.SetSalesFiguresDate,
          seatsSold: parseInt(sale.Seats) || 0,
          seatsSaleChange: '',
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
          isFinal: sale.SetIsFinalFigures,
          notOnSaleDate: sale.NotOnSaleDate,
          // saleType: sale.SaleTypeName,
          ...(sale.SaleTypeName === 'General Sales' && {
            seatsSold: parseInt(sale.Seats),
            totalValue: parseFloat(sale.Value),
          }),
          ...(sale.SaleTypeName === 'General Reservations' && {
            reserved: parseInt(sale.Seats),
            reservations: sale.Value ? numeral(sale.Value).format(sale.VenueCurrencySymbol + '0,0.00') : '',
          }),
        },
      };
    }, {});


    Object.entries(groupedData).forEach(([key, groupValue], index) => {
    
      const last = groupedData[Object.keys(groupedData)[index -1]]
      const current = groupedData[Object.keys(groupedData)[index]]
     
      // reserved value will also be added here
      groupedData[key].valueChange = index === 0 ? current.totalValue : current.totalValue - last.totalValue;
      groupedData[key].seatsSaleChange = index === 0 ? current.totalValue : current.totalValue - last.totalValue;

      // const seatsSoldChange = current.seatsSold - last.seatsSold;

      groupedData[key].seatsChange = index === 0 ? current.seatsSold : current.seatsSold - last.seatsSold;

    });

    res.json(Object.values(groupedData));
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: 'Error occurred while generating search results.' });
  }
}
