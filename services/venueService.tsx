import prisma from "lib/prisma"

export const venueService = {
  venuesWithinDistance,
}

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
async function venuesWithinDistance(venue, travelDistance) {

    console.log(venue + " " + travelDistance)
     fetch(`/api/venue/read/venueVenue/${venue}/${travelDistance}` )
        .then((res) => res.json())
        .then((data) => {
            return  data
        })


}
