export const venueService = {
    venuesWithinDistance,

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