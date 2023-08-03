import { Prisma } from '@prisma/client'
import prisma from 'lib/prisma'

type BookingSelectionView = {
  BookingId : number,
  BookingStatusCode : string,
  BookingFirstDate : string,
  VenueId : number,
  VenueCode : string,
  VenueMainAddressTown : string,
  TourId : number,
  FullTourCode : string,
  TourLengthWeeks : number,
}

const handler = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(404).send()
    }
    const { venueCode, salesByType, showCode } = req.body || {}
    if (!venueCode || !salesByType || !showCode) {
      throw new Error('Params are missing')
    }
    const conditions: Prisma.Sql[] = []
    conditions.push(Prisma.sql`FullTourCode Like ${showCode + '%'}`)
    if (salesByType === 'venue') {
      conditions.push(Prisma.sql`VenueCode = ${venueCode}`)
    }
    if (salesByType === 'town') {
      const venue = await prisma.$queryRaw`Select * from VenueView where VenueCode=${venueCode}`
      if (venue.length) {
        conditions.push(Prisma.sql`VenueMainAddressTown = ${venue?.[0]?.VenueMainAddressTown}`)
      } else {
        return res.status(404).send({ ok: false, message: 'Invalid venue code' })
      }
    }
    const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty
    const data: BookingSelectionView[] = await prisma.$queryRaw`select * FROM BookingSelectionView ${where};`

    res.send(data)
  } catch (error) {
    res.status(500).send({ ok: false, message: error?.message })
  }
}

export default handler
