import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 *
 * Convert Codes into a tour ID
 *
 * @param ShowCode
 * @param TourCodde
 */
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
