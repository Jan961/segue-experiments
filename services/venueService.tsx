import { VenueVenue } from '@prisma/client'
import prisma from 'lib/prisma'

export const getAllVenuesMin = async () => {
  return prisma.venue.findMany(
    {
      where: {
        IsDeleted: false
      },
      select: {
        Id: true,
        Name: true,
        Code: true
      }
    }
  )
}

export const getAllVenues = async () => {
  return prisma.venue.findMany(
    {
      where: {
        IsDeleted: false
      }
    }
  )
}

export interface DistanceStop {
  Date: string
  Ids: number[]
}

interface DistanceDTO {
  VenueId: number
  Mins?: number
  Miles?: number
}

export interface DateDistancesDTO {
  Date: string
  option: DistanceDTO[]
}

// If slow. Optimisation possible (Hash lookup)
export const getDistances = async (stops: DistanceStop[]): Promise<DateDistancesDTO[]> => {
  const ids = stops.map(x => x.Ids).flat()

  // Get the distances for all possible combinations (optimisation possible)
  const distances = await prisma.venueVenue.findMany({
    where: {
      Venue1Id: {
        in: ids
      }, // And
      Venue2Id: {
        in: ids
      }
    }
  })

  // Hold the previous stop for distance lookup
  let prev = null

  return stops.map((stop: DistanceStop) => {
    if (!prev || prev.Ids.length > 1) { // If the last stop has multiple options, we don't know which
      prev = stop
      return { Date: stop.Date, option: stop.Ids.map((id) => ({ VenueId: id, Miles: undefined, Mins: undefined })) }
    }

    return {
      Date: stop.Date,
      option: stop.Ids.map((id: number) => {
        // Get any distances that match (optimisation possible)
        const match = distances.filter((x: VenueVenue) => (
          (x.Venue2Id === id && x.Venue1Id === prev.Ids[0]) ||
          (x.Venue1Id === id && x.Venue2Id === prev.Ids[0])
        ))[0]
        prev = stop

        return {
          VenueId: id,
          Miles: match?.Mileage ? match.Mileage : undefined,
          Mins: match?.TimeMins ? match.TimeMins : undefined
        }
      })
    }
  })
}

/**
 * Retunrn a list ov venues within a radius distance of another
 *
 * from VenueVenue table
 *
 * Venue1Id current venue
 * distance miles willing to travel
 *
 * SELECT * FROM `VenueVenue` WHERE `Venue1Id` = 343 AND `Mileage` <= 50;
 *
 * this query returns 124  records
 *
 * @param venue
 * @param travelDistance
 */
export const venuesWithinDistance = (venue, travelDistance) => {
  console.log(venue + ' ' + travelDistance)
  fetch(`/api/venue/read/venueVenue/${venue}/${travelDistance}`)
    .then((res) => res.json())
    .then((data) => {
      return data
    })
}
