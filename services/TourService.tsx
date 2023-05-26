import prisma from 'lib/prisma'
import { Prisma } from '@prisma/client'

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

// Booking List
const tourContentSelect = Prisma.validator<Prisma.TourSelect>()({
  DateBlock: {
    select: {
      Id: true,
      Booking: {
        select: {
          Id: true,
          FirstDate: true
        }
      },
      Name: true
    }
  }
})

export type TourWithBookingsType = Prisma.TourGetPayload<{
  select: typeof tourContentSelect
}>

export const getTourWithBookingsById = async (Id: number) => {
  return await prisma.tour.findUnique({
    where: {
      Id
    },
    select: tourContentSelect
  })
}

// Edit Tour Page
const tourDateBlockIndlude = Prisma.validator<Prisma.TourSelect>()({
  Show: true,
  DateBlock: true
})

export type TourWithDateblocks = Prisma.TourGetPayload<{
  include: typeof tourDateBlockIndlude
}>

export const getTourById = async (Id: number) => {
  return await prisma.tour.findUnique({
    where: {
      Id
    },
    include: tourDateBlockIndlude
  })
}
