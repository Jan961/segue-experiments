import { Prisma } from '@prisma/client';
import prisma from 'lib/prisma';
import { SeatsInfo, TSalesView } from 'types/MarketingTypes';
import numeral from 'numeral';
import { checkAccess, getEmailFromReq } from 'services/userService';
import { getCurrencyFromBookingId } from 'services/venueCurrencyService';

// param.VenueCurrencySymbol to be added back in using unicode value
const getSeatsRelatedInfo = (param: TSalesView, currencySymbol: string): SeatsInfo => ({
  Seats: param.Seats,
  ValueWithCurrencySymbol: param.Value ? `${currencySymbol} ${numeral(param.Value).format('0,0.00')}` : '',
  BookingId: param.BookingId,
  DataFound: true,
  SetSalesFiguresDate: param.SetSalesFiguresDate,
});

const getSeatsRelatedInfoAsNull = (bookingId: number): SeatsInfo => ({
  Seats: null,
  ValueWithCurrencySymbol: '',
  BookingId: bookingId,
  DataFound: false,
  SetSalesFiguresDate: '',
});

const rearrangeArray = ({
  arr,
  bookingIds,
  currencySymbol,
}: {
  arr: TSalesView[];
  bookingIds: number[];
  currencySymbol: string;
}): SeatsInfo[] => {
  const arrangedArray: SeatsInfo[] = [];
  const totalBookings = bookingIds.length;
  for (let i = 0; i < totalBookings; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].BookingId === bookingIds[i]) {
        arrangedArray.push(getSeatsRelatedInfo(arr[j], currencySymbol));
        break;
      }

      if (j === arr.length - 1) {
        arrangedArray.push(getSeatsRelatedInfoAsNull(bookingIds[i]));
      }
    }
  }
  return arrangedArray;
};

export const getArchivedSalesList = async (bookingIds) => {
  const data: TSalesView[] = await prisma.$queryRaw`select * from SalesView where BookingId in (${Prisma.join(
    bookingIds,
  )}) and SaleTypeName = \'General Sales\' order by BookingFirstDate, SetSalesFiguresDate limit 300`;
  const formattedData: TSalesView[] = data.filter(
    (x: TSalesView) => bookingIds.includes(x.BookingId) && x.SaleTypeName === 'General Sales',
  );
  const commonData = formattedData
    .filter((x: TSalesView) => x.BookingId === bookingIds[0])
    .map(
      ({
        SetBookingWeekNum,
        SetProductionWeekDate,
        SetIsFinalFigures,
        SetNotOnSale,
        SetBrochureReleased,
        SetSingleSeats,
      }) => ({
        SetBookingWeekNum,
        SetProductionWeekDate,
        SetIsFinalFigures,
        SetNotOnSale,
        SetBrochureReleased,
        SetSingleSeats,
      }),
    );
  commonData.sort((a, b) => {
    const t1 = Number(a.SetBookingWeekNum);
    const t2 = Number(b.SetBookingWeekNum);
    return t1 - t2;
  });
  const currencySymbol = (await getCurrencyFromBookingId(bookingIds[0])) || '';
  const result: TSalesView[][] = commonData.map(({ SetBookingWeekNum }) =>
    formattedData.reduce((acc, y) => (y.SetBookingWeekNum === SetBookingWeekNum ? [...acc, y] : [...acc]), []),
  );

  const archivedSalesList = commonData.reduce(
    (acc, x, idx) => [
      ...acc,
      {
        SetBookingWeekNum: x.SetBookingWeekNum,
        SetProductionWeekDate: x.SetProductionWeekDate,
        SetIsFinalFigures: x.SetIsFinalFigures,
        data: rearrangeArray({ arr: result[idx], bookingIds, currencySymbol }),
        SetNotOnSale: x.SetNotOnSale,
        SetBrochureReleased: x.SetBrochureReleased,
        SetSingleSeats: x.SetSingleSeats,
      },
    ],
    [],
  );
  return archivedSalesList;
};

export default async function handle(req, res) {
  try {
    const bookingIds: number[] = req.body.bookingIds;
    if (!bookingIds) {
      throw new Error('Params are missing');
    }

    const email = await getEmailFromReq(req);
    for (const BookingId of bookingIds) {
      const access = await checkAccess(email, { BookingId });
      if (!access) return res.status(401).end();
    }

    const archivedSalesList = await getArchivedSalesList(bookingIds);

    res.status(200).json(archivedSalesList);
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while generating search results.', message: error.message });
  }
}
