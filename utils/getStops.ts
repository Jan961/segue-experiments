import { DistanceStop } from 'services/venueService'
import { BookingState } from 'state/booking/bookingState'

export const getStops = (bookingDict: BookingState) => {
  // Get distances
  const grouped = Object.values(bookingDict).reduce((acc, { VenueId, Date }) => {
    (acc[Date] = acc[Date] || []).push(VenueId)
    return acc
  }, {})

  const stops = Object.entries(grouped).map(([Date, Ids]): DistanceStop => ({ Date, Ids: Ids as number[] }))
  return stops.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())
}
