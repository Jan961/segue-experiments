import { VenueVenue } from '@prisma/client'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export interface GapSuggestionParams {
  StartVenue: number
  MinMins: number
  MaxMins: number
  MinMiles: number
  MaxMiles: number
  EndVenue: number
}

type VenueWithDistance = {
  VenueId: number,
  Mins: number,
  Miles: number
}

export type GapSuggestionReponse = {
  VenueInfo?: VenueWithDistance[]
  OriginalMiles: number
  OriginalMins: number
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const { StartVenue, EndVenue, MinMiles, MaxMiles, MinMins, MaxMins } = req.body as GapSuggestionParams

  try {
    const initial = await prisma.venueVenue.findMany({
      select: {
        Mileage: true,
        TimeMins: true
      },
      where: {
        OR: [
          {
            AND: [
              { Venue1Id: StartVenue },
              { Venue2Id: EndVenue }
            ]
          },
          {
            AND: [
              { Venue1Id: EndVenue },
              { Venue2Id: StartVenue }
            ]
          }
        ]
      }
    })

    const endVenue1Ids = await prisma.venueVenue
      .findMany({
        where: {
          Venue1Id: EndVenue,
          Mileage: { gte: MinMiles, lte: MaxMiles },
          TimeMins: { gte: MinMins, lte: MaxMins }
        },
        select: {
          Venue2Id: true
        }
      })
      .then((venues) => venues.map((venue) => venue.Venue2Id))

    const endVenue2Ids = await prisma.venueVenue
      .findMany({
        where: {
          Venue2Id: EndVenue,
          Mileage: { gte: MinMiles, lte: MaxMiles },
          TimeMins: { gte: MinMins, lte: MaxMins }
        },
        select: {
          Venue1Id: true
        }
      })
      .then((venues) => venues.map((venue) => venue.Venue1Id))

    const withinDistance = await prisma.venueVenue.findMany({
      where: {
        OR: [
          {
            Venue1Id: StartVenue,
            Venue2Id: {
              in: endVenue1Ids
            },
            Mileage: { gte: MinMiles, lte: MaxMiles },
            TimeMins: { gte: MinMins, lte: MaxMins }
          },
          {
            Venue2Id: StartVenue,
            Venue1Id: {
              in: endVenue2Ids
            },
            Mileage: { gte: MinMiles, lte: MaxMiles },
            TimeMins: { gte: MinMins, lte: MaxMins }
          }
        ]
      }
    })

    const idsWithDistance = withinDistance.map((x: VenueVenue): VenueWithDistance => {
      if (x.Venue1Id === StartVenue && x.Venue2Id === EndVenue) {
        return null
      }
      if (x.Venue1Id === EndVenue && x.Venue2Id === StartVenue) {
        return null
      }
      if (x.Venue1Id === StartVenue) {
        return { VenueId: x.Venue2Id, Mins: x.TimeMins, Miles: x.Mileage }
      }
      if (x.Venue2Id === StartVenue) {
        return { VenueId: x.Venue1Id, Mins: x.TimeMins, Miles: x.Mileage }
      }
      return null
    }).filter((x: any) => !!x)

    const result: GapSuggestionReponse = {
      OriginalMiles: initial[0] ? initial[0].Mileage : undefined,
      OriginalMins: initial[0] ? initial[0].TimeMins : undefined,
      VenueInfo: idsWithDistance
    }

    res.status(200).json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Error calculating gap suggestion' })
  }
}
