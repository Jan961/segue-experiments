import { DateBlock, GetInFitUp, Rehearsal, Show, Performance as PerformanceType, Booking } from '@prisma/client'
import { BookingDTO, DateBlockDTO, GetInFitUpDTO, PerformanceDTO, RehearsalDTO, ShowDTO, TourDTO } from 'interfaces'
import { ShowWithTours } from 'services/ShowService'
import { TourWithDateblocks } from 'services/TourService'
import { BookingsWithPerformances } from 'services/bookingService'

/*

Map between Prisma and DTO. This is as the bandwidth used for the
full model is too much, and we don't want to
leak implimentation details.

An example of this, is you might want to do a vanue lookup, and only transmit needed fields to the browser.

DateTimes are converted to strings and rendered into dates at display. JS Dates do not transfer over AJAX
MySQL has different fields for Date and Time (performances), this needs to be mapped

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
  return s.Tour.map(tourEditorMapper)
}

export const dateBlockMapper = (db: DateBlock): DateBlockDTO => ({
  Id: db.Id,
  StartDate: db.StartDate.toISOString(),
  EndDate: db.EndDate.toISOString(),
  Name: db.Name
})

export const rehearsalMapper = (r: Rehearsal): RehearsalDTO => ({
  Id: r.Id,
  Date: r.Date.toISOString(),
  Town: r.Town,
  StatusCode: r.StatusCode
})

export const bookingMapper = (b: BookingsWithPerformances): BookingDTO => ({
  Date: b.FirstDate.toISOString(),
  Id: b.Id,
  VenueId: b.VenueId,
  LandingSite: b.LandingPageURL,
  StatusCode: b.StatusCode as any,
  PencilNum: b.PencilNum,
  OnSaleDate: b.TicketsOnSaleFromDate ? b.TicketsOnSaleFromDate.toISOString() : '',
  OnSale: b.TicketsOnSale,
  PerformanceIds: b.Performance?.map((p: PerformanceType) => p.Id)
})

export const performanceMapper = (p: PerformanceType): PerformanceDTO => {
  const day = p.Date.toISOString().split('T')[0]
  const time = p.Time.toISOString().split('T')[1]
  const Date = `${day}T${time}`

  return {
    Id: p.Id,
    Date,
    BookingId: p.BookingId
  }
}

export const getInFitUpMapper = (gifu: GetInFitUp): GetInFitUpDTO => (
  { Date: gifu.Date.toISOString(), Id: gifu.Id }
)

export const tourEditorMapper = (t: TourWithDateblocks): TourDTO => ({
  Id: t.Id,
  ShowId: t.Show.Id,
  ShowName: t.Show.Name,
  Code: t.Code,
  ShowCode: t.Show.Code,
  DateBlock: t.DateBlock.map(dateBlockMapper),
  IsArchived: t.IsArchived
})
