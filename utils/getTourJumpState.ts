import { ParsedUrlQuery } from 'querystring'
import { getToursByShowCode } from 'services/TourService'
import { TourJump } from 'state/booking/tourJumpState'

interface Params extends ParsedUrlQuery {
  ShowCode: string
  TourCode: string
}

export const getTourJumpState = async (ctx, path: string): Promise<TourJump> => {
  const { ShowCode, TourCode } = ctx.params as Params
  const toursRaw = await getToursByShowCode(ShowCode as string)

  return {
    tours: toursRaw.map((t: any) => (
      {
        Code: t.Code,
        IsArchived: t.IsArchived,
        ShowCode: t.Show.Code
      })),
    selected: TourCode,
    path
  }
}
