import { Show as PrismaShow } from '@prisma/client'
import { Show } from 'interfaces'
import { ShowWithTours } from 'services/ShowService'

/*

Map between Prisma and DTO. This is when the bandwidth used for the
full model is too much, or we don't want to
leak implimentation details

*/

export const showMapper = (show: PrismaShow): Show => ({
  ShowId: show.Id,
  Name: show.Name,
  ShowType: show.Type,
  Code: show.Code,
  archived: show.IsArchived,
  deleted: show.IsDeleted
})

export const tourMapper = (show: ShowWithTours): any => {
  return show.Tour.map(tour => {
    return {
      Id: tour.Id,
      ShowId: show.Id,
      Name: show.Name,
      Code: tour.Code,
      ShowCode: show.Code,
      DateBlock: tour.DateBlock,
      IsArchived: tour.IsArchived
    }
  })
}
