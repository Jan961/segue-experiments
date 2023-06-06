import { faCar, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PropsWithChildren } from 'react'
import { useRecoilValue } from 'recoil'
import { dateService } from 'services/dateService'
import { bookingDictSelector } from 'state/booking/selectors/bookingDictSelector'
import { distanceDictSelector } from 'state/booking/selectors/distanceDictSelector'
import { venueDictSelector } from 'state/booking/selectors/venueDictSelector'

interface VenueDisplayProps {
  bookingId: number
  date: string
}

export const VenueDisplay = ({ bookingId, children, date }: PropsWithChildren<VenueDisplayProps>) => {
  const bookingDict = useRecoilValue(bookingDictSelector)
  const venueDict = useRecoilValue(venueDictSelector)
  const distanceDict = useRecoilValue(distanceDictSelector)

  if (!bookingId) return null

  const booking = bookingDict[bookingId]
  const venue = venueDict[booking.VenueId]

  const options = distanceDict[booking.Date]
  const distance = options?.option?.filter((o) => o.VenueId === venue.Id)[0]

  const first = booking.Date.startsWith(date)

  return (
    <div className="grid grid-cols-7">

      <div className="col-span-5">
        { venue ? venue.Name : 'No Venue' }
        <br />
        { children }
      </div>
      <div className="col-span-1 mx-2 whitespace-nowrap text-center">
        { first && distance && (
          <>
            <FontAwesomeIcon icon={faCar} className='opacity-50 mr-2'/>
            { distance.Miles ? distance.Miles + 'm' : 'N/A' }
          </>
        ) }
      </div>
      <div className="col-span-1 mx-2 whitespace-nowrap text-center">
        { first && distance && (
          <>
            <FontAwesomeIcon icon={faClock} className='opacity-50 mr-2'/>
            { distance.Mins ? distance.Mins + 'm' : 'N/A' }
          </>
        ) }
      </div>
    </div>
  )
}
