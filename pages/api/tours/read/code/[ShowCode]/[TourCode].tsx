import { NextApiRequest, NextApiResponse } from 'next'
import { getTourById, lookupTourId } from 'services/TourService'
import { getAccountId, getEmailFromReq } from 'services/userService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const { TourCode, ShowCode } = req.query

  if (!TourCode || !ShowCode) return res.end(400)

  const email = await getEmailFromReq(req)
  const AccountId = await getAccountId(email)

  try {
    const { Id } = await lookupTourId(ShowCode as string, TourCode as string, AccountId)
    const result = await getTourById(Id)
    res.json(result)
  } catch (e) {
    console.log(e)
  }
}
