import prisma from 'lib/prisma'
import { TSalesView } from 'types/MarketingTypes'

export type SeatsInfo = {
    Seats: number | null,
    ValueWithCurrencySymbol: string,
    BookingId: number,
    DataFound: boolean
  }

const getSeatsRelatedInfo = (param:TSalesView): SeatsInfo => (
  {
    Seats: param.Seats,
    ValueWithCurrencySymbol: param.Value ? `${param.VenueCurrencySymbol}${param.Value}` : '',
    BookingId: param.BookingId,
    DataFound: true
  }
)

const getSeatsRelatedInfoAsNull = (bookingId: number): SeatsInfo => (
  {
    Seats: null,
    ValueWithCurrencySymbol: '',
    BookingId: bookingId,
    DataFound: false
  }
)

const rearrangeArray = ({ arr, bookingIds }: {arr: TSalesView[], bookingIds: number[]}): SeatsInfo[] => {
  const arrangedArray: SeatsInfo[] = []
  const totalBookings = bookingIds.length
  for (let i = 0; i < totalBookings; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (arr[j].BookingId === bookingIds[i]) {
        arrangedArray.push(getSeatsRelatedInfo(arr[j]))
        break
      }

      if (j === arr.length - 1) {
        arrangedArray.push(getSeatsRelatedInfoAsNull(bookingIds[i]))
      }
    }
  }
  return arrangedArray
}

export default async function handle (req, res) {
  try {
    const bookingIds: number[] = req.body.bookingIds
    const data: TSalesView[] = await prisma.$queryRaw`select * from SalesView where BookingId in (${bookingIds.join(',')}) order by BookingFirstDate, SetSalesFiguresDate`

    const formattedData: TSalesView[] = data.filter((x: TSalesView) => bookingIds.includes(x.BookingId))
    const commonData = formattedData.filter((x: TSalesView) => x.BookingId === bookingIds[0]).map(({ SetTourWeekNum, SetTourWeekDate }) => ({ SetTourWeekNum, SetTourWeekDate }))
    commonData.sort((a, b) => {
      const t1 = Number(a.SetTourWeekNum)
      const t2 = Number(b.SetTourWeekNum)
      return t1 - t2
    })

    const result: TSalesView[][] = commonData.map(({ SetTourWeekNum, SetTourWeekDate }) => formattedData.reduce(
      (acc, y) =>
        (y.SetTourWeekDate === SetTourWeekDate && y.SetTourWeekNum === SetTourWeekNum) ? [...acc, y] : [...acc]
      , [])
    )

    res.send({
      input: bookingIds.map(x => ({ BookingId: x })),
      response: commonData.reduce((acc, x, idx) => ([
        ...acc,
        {
          SetTourWeekNum: x.SetTourWeekNum,
          SetTourWeekDate: x.SetTourWeekDate,
          data: rearrangeArray({ arr: result[idx], bookingIds })
        }
      ]), [])
    })
  } catch (err) {
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
