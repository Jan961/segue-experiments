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

export const getToursByShowCode = (Code: string) => {
  return prisma.tour.findMany({
    where: {
      Show: {
        Code
      }
    },
    select: {
      Code: true,
      IsArchived: true,
      Show: {
        select: {
          Code: true
        }
      }
    }
  })
}

// Booking List
const tourContentInclude = Prisma.validator<Prisma.TourSelect>()({
  Show: true,
  DateBlock: {
    include: {
      Booking: {
        include: {
          Performance: true
        }
      },
      GetInFitUp: true,
      Rehearsal: true,
      Other: true
    }
  }
})

export type TourContent = Prisma.TourGetPayload<{
  include: typeof tourContentInclude
}>

export const getTourWithContent = async (Id: number) => {
  return await prisma.tour.findUnique({
    where: {
      Id
    },
    include: tourContentInclude
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
