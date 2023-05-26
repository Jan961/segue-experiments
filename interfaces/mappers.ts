import { Show } from '@prisma/client'
import { ShowDTO, TourDTO } from 'interfaces'
import { ShowWithTours } from 'services/ShowService'
import { TourWithDateblocks } from 'services/TourService'

/*

Map between Prisma and DTO. This is when the bandwidth used for the
full model is too much, or we don't want to
leak implimentation details.

An example of this, is you might want to do a user lookup, and only transmit 'safe' fields to the browser.

DateTimes are converted to strings for rendering in the UI. JS Dates do not transfer over AJAX

We also have full control of types here so we can get type safety to child objects

*/

export const showMapper = (show: Show): ShowDTO => ({
  Id: show.Id,
  Name: show.Name,
  Type: show.Type,
  Code: show.Code,
  IsArchived: show.IsArchived
})

export const tourMapper = (s: ShowWithTours): TourDTO[] => {
  return s.Tour.map(t => {
    return {
      Id: t.Id,
      ShowId: s.Id,
      ShowName: s.Name,
      Code: t.Code,
      ShowCode: s.Code,
      DateBlock: t.DateBlock.map(db => ({
        Id: db.Id,
        StartDate: db.StartDate.toISOString(),
        EndDate: db.EndDate.toISOString(),
        Name: db.Name
      })),
      IsArchived: t.IsArchived
    }
  })
}

export const tourEditorMapper = (t: TourWithDateblocks): TourDTO => ({
  Id: t.Id,
  ShowId: t.Show.Id,
  ShowName: t.Show.Name,
  Code: t.Code,
  ShowCode: t.Show.Code,
  DateBlock: t.DateBlock.map(db => ({
    Id: db.Id,
    StartDate: db.StartDate.toISOString(),
    EndDate: db.EndDate.toISOString(),
    Name: db.Name
  })),
  IsArchived: t.IsArchived
})

/*
export const bookingMapper = (tour: TourWithBookingsType): DateBlockDTO[] => (
  tour.DateBlock.map((db) => ({
    Id: db.Id,
    Name: db.Name,
    Bookings: db.Booking.map((b) => ({ Id: b.Id, ShowDate: b.FirstDate.toISOString() }))
  }))
)
*/
