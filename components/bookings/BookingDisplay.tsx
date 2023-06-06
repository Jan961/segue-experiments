import { PropsWithChildren } from 'react'
import { useRecoilValue } from 'recoil'
import { bookingDictSelector } from 'state/booking/selectors/bookingDictSelector'
import { distanceDictSelector } from 'state/booking/selectors/distanceDictSelector'
import { venueDictSelector } from 'state/booking/selectors/venueDictSelector'

interface VenueDisplayProps {
  bookingId: number
  date: string
  performanceCount: number;
}

const timeFormat = (mins?: number) => {
  if (!mins) return 'N/A'
  return `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`
}

export const BookingDisplay = ({ bookingId, performanceCount, date }: PropsWithChildren<VenueDisplayProps>) => {
  const bookingDict = useRecoilValue(bookingDictSelector)
  const venueDict = useRecoilValue(venueDictSelector)
  const distanceDict = useRecoilValue(distanceDictSelector)

  if (!bookingId) return null

  const booking = bookingDict[bookingId]
  const venue = venueDict[booking.VenueId]

  const options = distanceDict[booking.Date]
  const distance = options?.option?.filter((o) => o.VenueId === venue.Id)[0]

  const first = booking.Date.startsWith(date)

  const venueClass = first ? '' : 'opacity-25'

  return (
    <div className="grid grid-cols-10">

      <div className="col-span-7">
        <span className={venueClass}>
          { venue ? venue.Name : 'No Venue' }
        </span>
      </div>
      <div className="col-span-1">
        x { performanceCount }
      </div>
      <div className="col-span-1 mx-2 whitespace-nowrap text-center">
        { first && distance && (
          <>
            { distance.Miles ? distance.Miles + 'm' : 'N/A' }
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
