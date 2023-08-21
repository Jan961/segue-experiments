import { ParsedUrlQuery } from 'querystring'
import { getAllTours } from 'services/TourService'
import { TourJump } from 'state/booking/tourJumpState'

interface Params extends ParsedUrlQuery {
  ShowCode: string
  TourCode: string
}

export const getTourJumpState = async (ctx, path: string): Promise<TourJump> => {
  const { TourCode, ShowCode } = ctx.params as Params
  const toursRaw = await getAllTours()
  const selectedTour = toursRaw.find((tour:any) => tour.Code === TourCode && tour.Show.Code === ShowCode)?.Id
  return {
    tours: toursRaw.map((t: any) => (
      {
        Id: t.Id,
        Code: t.Code,
        IsArchived: t.IsArchived,
        ShowCode: t.Show.Code,
        ShowName: t.Show.Name
      })),
    selected: selectedTour,
    path
  }
}
