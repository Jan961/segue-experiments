import { Show as PrismaShow } from '@prisma/client'
import { DateBlockDTO, ShowDTO } from 'interfaces'
import { ShowWithTours } from 'services/ShowService'
import { TourWithBookingsType } from 'services/TourService'

/*

Map between Prisma and DTO. This is when the bandwidth used for the
full model is too much, or we don't want to
leak implimentation details

*/

export const showMapper = (show: PrismaShow): ShowDTO => ({
  Id: show.Id,
  Name: show.Name,
  Type: show.Type,
  Code: show.Code,
  IsArchived: show.IsArchived
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

export const bookingMapper = (tour: TourWithBookingsType): DateBlockDTO[] => (
  tour.DateBlock.map((db) => ({
    Id: db.Id,
    Name: db.Name,
    Bookings: db.Booking.map((b) => ({ Id: b.Id, ShowDate: b.FirstDate.toISOString() }))
  }))
)
