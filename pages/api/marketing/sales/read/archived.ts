import getPrismaClient from 'lib/prisma';
import { SeatsInfo, TSalesView } from 'types/MarketingTypes';
import numeral from 'numeral';
import { getCurrencyFromBookingId } from 'services/venueCurrencyService';

let prisma = null;

const getSeatsRelatedInfo = (param: TSalesView, currencySymbol: string): SeatsInfo => ({
  Seats: param.Seats,
  ValueWithCurrencySymbol: param.Value ? `${currencySymbol} ${numeral(param.Value).format('0,0.00')}` : '',
  Value: param.Value || 0,
  currencySymbol,
  BookingId: param.BookingId,
  DataFound: true,
  SetSalesFiguresDate: param.SetSalesFiguresDate,
});

const getSeatsRelatedInfoAsNull = (bookingId: number): SeatsInfo => ({
  Seats: null,
  ValueWithCurrencySymbol: '',
  Value: 0,
  BookingId: bookingId,
  DataFound: false,
  SetSalesFiguresDate: '',
  currencySymbol: '',
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

const getArchivedSalesList = async (bookingIds: number[], currencySymbol: string) => {
  const data: TSalesView[] = await prisma.salesView.findMany({
    where: {
      BookingId: {
        in: bookingIds,
      },
      SaleTypeName: 'General Sales',
    },
    orderBy: [{ BookingFirstDate: 'asc' }, { SetSalesFiguresDate: 'asc' }],
    take: 300,
  });

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
    prisma = await getPrismaClient(req);
    const bookingIds: number[] = req.body.bookingIds;
    if (!bookingIds) {
      throw new Error('Params are missing');
    }
    const currencySymbol = (await getCurrencyFromBookingId(req, bookingIds[0])) || '';
    const archivedSalesList = await getArchivedSalesList(bookingIds, currencySymbol);

    res.status(200).json(archivedSalesList);
  } catch (error) {
    res.status(500).json({ error: 'Error occurred while generating search results.', message: error.message });
  }
}
