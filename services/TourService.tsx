import prisma from 'lib/prisma'

const getArrayOfDatesBetween = (start: Date, end: Date) => {
  const arr = []

  for (const dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getUTCDate() + 1)) {
    arr.push(new Date(dt))
  }
  return arr
}

export const createTour = async (tour: any) => {
  const tourDates = getArrayOfDatesBetween(tour.TourStartDate, tour.TourEndDate)
  const rehearsalDates = getArrayOfDatesBetween(tour.RehearsalStartDate, tour.RehearsalEndDate)

  const getDefaultBooking = (date: Date, dateTypeId: number) => (
    {
      ShowDate: date,
      Notes: 'Generated',
      DateTypeId: dateTypeId,
      OnSale: false,
      MarketingPlanReceived: false,
      PrintReqsReceived: false,
      ContactInfoReceived: false,
      BookingStatus: 'C'
    }
  )

  // Generate default bookings
  const allDates = [
    ...tourDates.map(x => getDefaultBooking(x, 1)),
    ...rehearsalDates.map(x => getDefaultBooking(x, 18))
  ]

  return prisma.tour.create({ data: { ...tour, Booking: { create: allDates } } })
}

export const getTourByCode = async (ShowCode: string, TourCode: string) => {
  return prisma.tour.findFirst(
    {
      where: {
        Code: TourCode as string,
        Show: {
          Code: ShowCode as string
        }
      },
      include: {
        Show: true
      }
    }
  )
}

export const getTourById = async (TourId: number) => {
  return await prisma.tour.findUnique({
    where: {
      TourId
    },
    include: {
      Show: true
    }
  })
}
