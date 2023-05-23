import { Show as PrismaShow } from '@prisma/client'
import { Show } from 'interfaces'

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
