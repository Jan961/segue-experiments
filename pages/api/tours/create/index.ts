import { NextApiRequest, NextApiResponse } from 'next'
import { createTour } from 'services/TourService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const tour = {
      Code: req.body.Code,
      ShowId: req.body.ShowId,
      TourStartDate: new Date(req.body.TourStartDate),
      TourEndDate: new Date(req.body.TourEndDate),
      Archived: false,
      Deleted: false,
      RehearsalStartDate: new Date(req.body.RehearsalStartDate),
      RehearsalEndDate: new Date(req.body.RehearsalEndDate),
      TourOwner: req.body.Owner,
      Logo: req.body.Logo ? req.body.Logo : null,
      CreatedBy: null
    }

    const result = await createTour(tour)

    res.statusCode = 200
    res.status(200).json(result)
    res.setHeader('Content-Type', 'application/json')
  } catch (err) {
    console.log(err)
    res.status(403).json({ err: 'Error occurred while generating search results.' })
  }
}
