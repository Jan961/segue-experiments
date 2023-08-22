import { Prisma } from '@prisma/client'
import { ShowDTO } from 'interfaces'
import { showMapper } from 'lib/mappers'
import prisma from 'lib/prisma'

export const getShows = () => {
  return prisma.show.findMany()
}

export interface ShowPageProps {
  shows: ShowDTO[]
}

export const getShowPageProps = async () => {
  const shows = await getShows()

  return {
    props: {
      shows: shows.map(showMapper)
    }
  }
}

const showInclude = Prisma.validator<Prisma.ShowInclude>()({
  Tour: {
    where: { IsDeleted: false },
    include: { Show: true, DateBlock: true }
  }
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
