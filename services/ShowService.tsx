import {Venue} from "../interfaces";


/**
 *
 * This Service represents the barring engine
 * @type {{salesReport: *}}
 */
export const showService = {
  getShowByCode,

}

/**
 *
 * Convert Codes into a tour ID
 *
 * @param ShowCode
 * @param TourCodde
 */
function getShowByCode(ShowCode, TourCode){

    let Tour ={}
    fetch(`/api/tours/read/code/${ShowCode}/${TourCode}` )
        .then((res) => res.json())
        .then((data) => {
            Tour = data
        })
    return Tour
}
