import { DateBlock, Show } from '@prisma/client'
import { DateBlockDTO, DateDTO, ShowDTO, TourDTO } from 'interfaces'
import { ShowWithTours } from 'services/ShowService'
import { TourContent, TourWithDateblocks } from 'services/TourService'

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
  return s.Tour.map(tourEditorMapper)
}

export const dateBlockMapper = (db: DateBlock): DateBlockDTO => ({
  Id: db.Id,
  StartDate: db.StartDate.toISOString(),
  EndDate: db.EndDate.toISOString(),
  Name: db.Name
})

export const tourEditorMapper = (t: TourWithDateblocks): TourDTO => ({
  Id: t.Id,
  ShowId: t.Show.Id,
  ShowName: t.Show.Name,
  Code: t.Code,
  ShowCode: t.Show.Code,
  DateBlock: t.DateBlock.map(dateBlockMapper),
  IsArchived: t.IsArchived
})
