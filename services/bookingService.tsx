
export const bookingService = {
    updateBookingVenue,
    updateBookingDay,
    getPerformances
}

function updateBookingVenue(date, venueID, tourID){


    fetch(`/api/tours/booking/update/${tourID}/${venueID}/${date}` )
        .then((res) => res.json())
        .then((data) => {

        })
    return true


}

function  updateBookingDay(date: string, venueid: any) {
}


async function getPerformances(BookingId) {
    console.log("Booking Service Get Performances " + BookingId)
    await fetch(`/api/bookings/Performances/${BookingId}/`)
        .then(data => data)
        .then((data) => {
            console.log(data)
            return data
        })
}