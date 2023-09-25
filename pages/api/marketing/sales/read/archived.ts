import { Prisma } from '@prisma/client'
import prisma from 'lib/prisma'
import { TSalesView } from 'types/MarketingTypes'
import numeral from 'numeral'
import { checkAccess, getEmailFromReq } from 'services/userService'

export type SeatsInfo = {
    Seats: number | null,
    ValueWithCurrencySymbol: string,
    BookingId: number,
    DataFound: boolean
  }

const getSeatsRelatedInfo = (param:TSalesView): SeatsInfo => (
  {
    Seats: param.Seats,
    ValueWithCurrencySymbol: param.Value ? `${param.VenueCurrencySymbol + numeral(param.Value).format('0,0.00')}` : '',
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
    if (!bookingIds) {
      throw new Error('Params are missing')
    }

    const email = await getEmailFromReq(req)
    for (const BookingId of bookingIds) {
      const access = await checkAccess(email, { BookingId })
      if (!access) return res.status(401).end()
    }

    const data: TSalesView[] = await prisma.$queryRaw`select * from SalesView where BookingId in (${Prisma.join(bookingIds)}) and SaleTypeName = \'General Sales\' order by BookingFirstDate, SetSalesFiguresDate`
    const formattedData: TSalesView[] = data.filter((x: TSalesView) => bookingIds.includes(x.BookingId) && x.SaleTypeName === 'General Sales')
    const commonData = formattedData.filter((x: TSalesView) => x.BookingId === bookingIds[0]).map(({ SetBookingWeekNum, SetTourWeekDate }) => ({ SetBookingWeekNum, SetTourWeekDate }))
    commonData.sort((a, b) => {
      const t1 = Number(a.SetBookingWeekNum)
      const t2 = Number(b.SetBookingWeekNum)
      return t1 - t2
    })

    const result: TSalesView[][] = commonData.map(({ SetBookingWeekNum, SetTourWeekDate }) => formattedData.reduce(
      (acc, y) =>
        (y.SetBookingWeekNum === SetBookingWeekNum) ? [...acc, y] : [...acc]
      , [])
    )

    res.send({
      input: bookingIds.map(x => ({ BookingId: x })),
      response: commonData.reduce((acc, x, idx) => ([
        ...acc,
        {
          SetBookingWeekNum: x.SetBookingWeekNum,
          SetTourWeekDate: x.SetTourWeekDate,
          data: rearrangeArray({ arr: result[idx], bookingIds })
        }
      ]), [])
    })
  } catch (error) {
    res.status(403).json({ error: 'Error occurred while generating search results.', message: error.message })
  }
}
