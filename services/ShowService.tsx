import prisma from 'lib/prisma'

export const getShows = () => {
  return prisma.show.findMany()
}

export const getShowByCode = (ShowCode, TourCode) => {
  let Tour = {}
  fetch(`/api/tours/read/code/${ShowCode}/${TourCode}`)
    .then((res) => res.json())
    .then((data) => {
      Tour = data
    })
  return Tour
}

export const getShowById = async (showId: number) => {
  return await prisma.show.findFirst({
    where: {
      ShowId: showId,
      Archived: false
    }
  })
}
