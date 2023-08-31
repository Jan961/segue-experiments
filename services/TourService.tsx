import prisma from 'lib/prisma'
import { Prisma } from '@prisma/client'
import { tourMapper } from 'lib/mappers'
import { getShowWithToursById } from './ShowService'

// Edit Tour Page
const tourDateBlockInclude = Prisma.validator<Prisma.TourSelect>()({
  Show: true,
  DateBlock: true
})

export const getActiveTours = async (accountId:number) => {
  return prisma.tour.findMany({
    where: {
      IsArchived: false,
      Show: {
        AccountId: accountId
      }
    },
    include: tourDateBlockInclude
  })
}

export const getTourPageProps = async (ctx) => {
  const { ShowCode } = ctx.params

  const showRaw = await prisma.show.findUnique({
    where: {
      Code: ShowCode
    }
  })

  const show = await getShowWithToursById(showRaw?.Id)
  const tours = tourMapper(show)

  return { props: { tours, id: show.Id } }
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

export const getAllTours = async () => {
  return prisma.tour.findMany({
    select: {
      Id: true,
      Code: true,
      IsArchived: true,
      Show: {
        select: {
          Code: true,
          Name: true
        }
      }
    }
  })
}

export const getToursByShowCode = (Code: string) => {
  return prisma.tour.findMany({
    where: {
      Show: {
        Code
      }
    },
    select: {
      Id: true,
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

export type TourWithDateblocks = Prisma.TourGetPayload<{
  include: typeof tourDateBlockInclude
}>

export const getTourById = async (Id: number) => {
  return await prisma.tour.findUnique({
    where: {
      Id
    },
    include: tourDateBlockInclude
  })
}

export const getToursAndTasks = async () => {
  return await prisma.tour.findMany({
    where: {
      IsArchived: false
    },
    include: {
      Show: true,
      TourTask: {
        orderBy: {
          Id: 'desc'
        },
        take: 10
      }
    }
  })
}
