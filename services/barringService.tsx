

/**
 *
 * This Service represents the barring engine
  * @type {{salesReport: *}}
 */
export const barringService = {
    checkBarringRule,
    getTourDate,
    barredVenueList
}


/**
 * Barring rule Check this will do a tour wide barring check
 *
 */
function checkBarringRule(){

    //For venue in the tour get the barring clauses build an array of pre weeks
    //for Venue build post




    return true
}

function barredVenueList(VenueId, TourId, Distance, London, TourOnly, Seats) {

    let BarringVenueList = fetch(`/api/barring/${VenueId}/${TourId}/${Distance}/${London}/${TourOnly}/${Seats}`)
        .then(barredVenueList => (barredVenueList.json()))
        .then(barredVenueList => (
            console.log(JSON.stringify(barredVenueList))
        ))

    return barredVenueList
}

/**
 *
 * This will check the barring rules as the tour bookings are created
 *
 * @param LastVenue
 * @param ProposedVenue
 * @param NextVenue
 */
function quickCheck(PerformanceVenue, VenueToCheck ){
    let barred = false  // Asume that the show can be put on here with no issues

    let barringDistance = 0 // Set distance to 0

    //let getVenueBarringWeeks()
    //let getCheckBarringWeeks()

    //if(barringWeeks < weeksBetweenEvents){
        let venueVenueDistance = getTravelDistrance(PerformanceVenue, VenueToCheck)
        //let perfomanceVenueDistance getBarringDistance(PerformanceVenue)
        //let CheckVenueDistance getBarringDistance(PerformanceVenue)
        if(barringDistance < venueVenueDistance){
            barred = true
        }

    //}

    return barred

}

/**
 * Get the distance in Time HH:MM between venues
 *
 * @param StartVenue
 * @param EndVenue
 */
function getTravelTime(StartVenue, EndVenue){
    let time = 0
    return time
}


/**
 * Get the distance in Miles between venues
 *
 * @param StartVenue
 * @param EndVenue
 */
function getTravelDistrance(StartVenue, EndVenue){
    let dictance = 0
    return dictance
}

function gapSuggestion(tourID){

    //Get a list of all elegable days

    // Get Tour StartDate - end Date

    // Find all dartes !Day off Between StrartDate and End Date

    // On Empty Date Find

}

/**
 * Retun a list of dates from the API
 *
 * @param TourId
 */
function getTourDate(TourId){

    console.log(TourId)
    let endpoint = (query) => `http://127.0.0.1:3000/api/tours/read/gaps/${query}`
    fetch(endpoint(TourId))
        .then(res => res.json())
        .then(res => {
            console.log(res.searchResults)

        })

}

/**
 * Get a list of venues the tour has already been at (Basic Barring, No Return)
 */
function getTourVenues(){

    let venues = ""
}

/**
 *
 * Get all venurs within distance from a given venue
 *
 * @param venue
 * @param distance
 */
function getVenuesDistance(venue, distance){

}


