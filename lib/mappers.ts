import { DateBlock, GetInFitUp, Rehearsal, Show, Performance as PerformanceType, DateType, Other, VenueContact, BookingActivity, BookingContactNotes, TourTask } from '@prisma/client'
import { ActivityDTO, BookingContactNoteDTO, BookingDTO, BookingWithVenueDTO, DateBlockDTO, DateTypeDTO, GetInFitUpDTO, OtherDTO, PerformanceDTO, RehearsalDTO, ShowDTO, StatusCode, TourDTO, TourTaskDTO, VenueContactDTO, VenueRoleDTO } from 'interfaces'
import { ShowWithTours } from 'services/ShowService'
import { TourWithDateblocks } from 'services/TourService'
import { BookingsWithPerformances } from 'services/bookingService'
import { toISO } from 'services/dateService'

/*

Map between Prisma and DTO. This is as the bandwidth used for the
full model is too much, and we don't want to
leak implimentation details.

An example of this, is you might want to do a vanue lookup, and only transmit needed fields to the browser.

DateTimes are converted to strings and rendered into dates at display. JS Dates do not transfer over AJAX
MySQL has different fields for Date and Time (performances), this needs to be mapped

We also have full control of types here so we can get type safety to child objects

*/

// This is so we can change the implimentation if needed. We had some issues with timezone.
const convertDate = (date: Date) => {
  if (date) return toISO(date)
  return ''
}

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
  StartDate: convertDate(db.StartDate),
  EndDate: convertDate(db.EndDate),
  Name: db.Name
})

export const rehearsalMapper = (r: Rehearsal): RehearsalDTO => ({
  Id: r.Id,
  Date: convertDate(r.Date),
  Town: r.Town,
  StatusCode: r.StatusCode
})

export const bookingMapper = (b: BookingsWithPerformances): BookingDTO => ({
  Date: convertDate(b.FirstDate),
  Id: b.Id,
  VenueId: b.VenueId,
  VenueName: b.Venue ? b.Venue.Name : undefined,
  LandingSite: b.LandingPageURL,
  StatusCode: b.StatusCode as any,
  PencilNum: b.PencilNum,
  OnSaleDate: convertDate(b.TicketsOnSaleFromDate),
  OnSale: b.TicketsOnSale
})

export const bookingMapperWithVenue = (b: any): BookingWithVenueDTO => ({
  ...bookingMapper(b),
  Venue: {
    Name: b.Venue.Name,
    Website: b.Venue.Website
  }
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

export const otherMapper = (o: Other): OtherDTO => ({
  Id: o.Id,
  Date: convertDate(o.Date),
  DateTypeId: o.DateTypeId,
  StatusCode: o.StatusCode as StatusCode
})

export const getInFitUpMapper = (gifu: GetInFitUp): GetInFitUpDTO => (
  {
    Date: convertDate(gifu.Date),
    Id: gifu.Id,
    VenueId: gifu.VenueId,
    StatusCode: gifu.StatusCode as StatusCode
  }
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

export const DateTypeMapper = (dt: DateType): DateTypeDTO => ({
  Id: dt.Id,
  Name: dt.Name
})

export const venueContactMapper = (vc: VenueContact): VenueContactDTO => ({
  Id: vc.Id,
  FirstName: vc.FirstName,
  LastName: vc.LastName,
  Phone: vc.Phone,
  Email: vc.Email,
  RoleId: vc.VenueRoleId
})

export const activityMapper = (a: BookingActivity): ActivityDTO => ({
  Id: a.Id,
  BookingId: a.BookingId,
  Date: convertDate(a.Date),
  Name: a.Name,
  ActivityTypeId: a.ActivityTypeId,
  CompanyCost: Number(a.CompanyCost),
  VenueCost: Number(a.VenueCost),
  FollowUpRequired: a.FollowUpRequired
})

export const bookingContactNoteMapper = (a: BookingContactNotes): BookingContactNoteDTO => ({
  Id: a.Id,
  BookingId: a.BookingId,
  CoContactName: a.CoContactName,
  ContactDate: convertDate(a.ContactDate),
  ActionByDate: convertDate(a.ActionByDate),
  Notes: a.Notes
})

export const mapToTourTaskDTO = (tourTask: TourTask): TourTaskDTO => {
  return {
    ...tourTask,
    DueDate: convertDate(tourTask.DueDate),
    FollowUp: convertDate(tourTask.FollowUp),
    CreatedDate: convertDate(tourTask.CreatedDate)
  }
}

export const venueRoleMapper = (vr: any): VenueRoleDTO => ({
  Id: vr.Id,
  Name: vr.Name
})
