import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const reportId = req.query.reportId as number
    res.status(200).json([])
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 'Error fetching report' })
  }
}