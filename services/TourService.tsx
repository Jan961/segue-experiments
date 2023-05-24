import prisma from 'lib/prisma'
import { add } from 'date-fns'
import { Prisma } from '@prisma/client'

// const CHUNK_SIZE = 20

const getArrayOfDatesBetween = (start: Date, end: Date) => {
  const arr = []

  const startDate = new Date(start)
  const endDate = new Date(end)

  for (let dt = startDate; dt <= endDate; dt = add(dt, { days: 1 })) {
    arr.push(new Date(dt))
  }
  return arr
}

export const createTour = async (tour: any) => {
  const tourDates = tour.TourStartDate ? getArrayOfDatesBetween(tour.TourStartDate, tour.TourEndDate) : []
  const rehearsalDates = tour.RehearsalStartDate ? getArrayOfDatesBetween(tour.RehearsalStartDate, tour.RehearsalEndDate) : []

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

  console.log(`Creating Booking: ${allDates.length} records`)

  return prisma.tour.create({ data: { ...tour, Booking: { create: allDates } }, select: { TourId: true } })

  // Batching
  /*
  const { TourId } = await prisma.tour.create({ data: { ...tour }, select: { TourId: true } })

  console.log('tour created')

  for (let i = 0; i < allDates.length / CHUNK_SIZE; i++) {
    console.log(i * CHUNK_SIZE)
    const chunk = allDates.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
    await prisma.booking.createMany({ data: chunk.map((x) => ({ ...x, TourId })) })
  }
  */
}

export const lookupTourId = async (ShowCode: string, TourCode: string) => {
  return prisma.tour.findFirst(
    {
      where: {
        Code: TourCode as string,
        Show: {
          Code: ShowCode as string
        }
      },
      select: {
        Id: true
      }
    }
  )
}

const tourBookingsSelect = Prisma.validator<Prisma.TourSelect>()({
  DateBlock: {
    select: {
      Id: true,
      Booking: {
        select: {
          Id: true,
          FirstDate: true,
          DateType: true
        }
      },
      Name: true
    }
  }
}
)

export type TourWithBookingsType = Prisma.TourGetPayload<{
  select: typeof tourBookingsSelect;
}>;

export const getTourWithBookingsById = async (Id: number) => {
  return await prisma.tour.findUnique({
    where: {
      Id
    },
    select: tourBookingsSelect
  })
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
