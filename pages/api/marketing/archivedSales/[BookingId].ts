import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

const HARDCODED = [
  { week: -51, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -50, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -49, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -48, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -47, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -46, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -45, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -44, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -43, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -42, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -41, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -40, weekOf: '10/10/2023', num: 0, value: 1 },
  { week: -39, weekOf: '10/10/2023', num: 0, value: 1 }
]


export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query.BookingId as string)
    const results = await prisma.bookingContactNotes.findMany({
      where: {
        BookingId
      }
    })

    res.json(HARDCODED)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Error occurred while generating search results.' })
  }
}
