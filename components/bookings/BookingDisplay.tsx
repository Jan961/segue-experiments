import { PropsWithChildren } from 'react'
import { useRecoilValue } from 'recoil'
import { timeFormat } from 'services/dateService'
import { bookingState } from 'state/booking/bookingState'
import { distanceDictSelector } from 'state/booking/selectors/distanceDictSelector'
import { venueState } from 'state/booking/venueState'

interface VenueDisplayProps {
  bookingId: number
  date: string
  performanceCount: number;
}

export const BookingDisplay = ({ bookingId, performanceCount, date }: PropsWithChildren<VenueDisplayProps>) => {
  const bookingDict = useRecoilValue(bookingState)
  const venueDict = useRecoilValue(venueState)
  const distanceDict = useRecoilValue(distanceDictSelector)

  if (!bookingId) return null

  const booking = bookingDict[bookingId]
  if (!booking) return null

  const venue = venueDict[booking.VenueId]

  const options = distanceDict[booking.Date]
  const distance = options?.option?.filter((o) => o.VenueId === venue.Id)[0]

  const first = booking.Date.startsWith(date)

  return (
    <div className="grid grid-cols-10 p-1 px-2">

      <div className="col-span-7">
        <span>
          { venue ? venue.Name : 'No Venue' }
        </span>
      </div>
      <div className="col-span-1">
        { performanceCount }
      </div>
      <div className="col-span-1 mx-2 whitespace-nowrap text-center">
        { first && distance && (
          <>
            { distance.Miles ? distance.Miles : '' }
          </>
        ) }
      </div>
      <div className="col-span-1 mx-2 whitespace-nowrap text-center">
        { first && distance && (
          <>
            { timeFormat(distance.Mins) }
          </>
        ) }
      </div>
    </div>
  )
}
