import {Venue} from "../interfaces";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

/**
 *
 * This Service represents the barring engine
 * @type {{salesReport: *}}
 */
export const tourService = {
  getTourByCode,
    getTourGaps,
    getTourVenueStatus
}

/**
 *
 * Convert Codes into a tour ID
 *
 * @param ShowCode
 * @param TourCodde
 */
function getTourByCode(ShowCode, TourCode){

    let Tour ={}
    fetch(`/api/tours/read/code/${ShowCode}/${TourCode}` )
        .then((res) => res.json())
        .then((data) => {
            Tour = data
        })
    return Tour
}

function getTourVenueByDate(TourId, Date){

    let venues: Venue = null
    // Call api

    return venues

}

function getNextTourVenue(TourID, Date){
    // Date + 1 day

    return getTourVenueByDate(TourID, Date)

}

function getLastTourVenue(TourID, Date){
    // Date - 1 day
    let venue = null

    /**
     * Run a loop to find he last venue as it may not be the day before
     */
    while (venue === null){
        let result = getTourVenueByDate(TourID, Date)
        venue = result.VenueId

    }
    // Only return the last venue 
    return venue
}

function getTourVenuesWithinDistance(VenueID, distance = null){
    let venues = [] // Empty array
    //Call api


    return venues

}

function getTourGaps(tourId){
    
    let gaps = []
    fetch(`${baseUrl}/tours/read/gaps/${tourId}`)
        .then((res) => res.json())
        .then((data) => {

            gaps = data
        })

    return gaps
}

function createTour(){


}

function getTourVenueStatus(tourID){

    let tourId = parseInt(tourID)
    let result
    fetch(`http://127.0.0.1:3000/api/marketing/venue/status/${tourId}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)

            result= data

        })
    return  result
}
