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
  const { venueCode, venueTown } = JSON.parse(req.body) || {}
  if (!venueCode || !venueTown) {
    throw new Error('Params are missing')
  }

  const conditions: Prisma.Sql[] = []
  if (venueCode) {
    conditions.push(Prisma.sql`VenueCode = ${venueCode}`)
  }
  if (venueTown) {
    conditions.push(Prisma.sql`VenueMainAddressTown = ${venueTown}`)
  }
  const where: Prisma.Sql = conditions.length ? Prisma.sql` where ${Prisma.join(conditions, ' and ')}` : Prisma.empty
  const data: BookingSelectionView[] = await prisma.$queryRaw`select * FROM BookingSelectionView ${where};`

  res.send(data)
}

export default handler
