import { Prisma } from '@prisma/client'
import prisma from 'lib/prisma'

export const getShows = () => {
  return prisma.show.findMany()
}

const showInclude = Prisma.validator<Prisma.ShowInclude>()({
  Tour: { include: { Show: true, DateBlock: true } }
})

export type ShowWithTours = Prisma.ShowGetPayload<{
  include: typeof showInclude;
}>;

export const getShowWithToursById = async (Id: number) => {
  return await prisma.show.findFirst({
    where: {
      Id
    },
    include: showInclude
  })
}

export const getShowById = async (Id: number) => {
  return await prisma.show.findFirst({
    where: {
      Id
    }
  })
}
