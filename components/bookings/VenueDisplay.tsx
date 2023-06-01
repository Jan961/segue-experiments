import { faCar, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRecoilValue } from 'recoil'
import { bookingDictSelector } from 'state/booking/selectors/bookingDictSelector'
import { distanceDictSelector } from 'state/booking/selectors/distanceDictSelector'
import { venueDictSelector } from 'state/booking/selectors/venueDictSelector'

interface VenueDisplayProps {
  bookingId: number
}

const DistanceDisplay = ({ miles }) => (<span className="mx-2">{ miles || '?' } mi</span>)
const TimeDisplay = ({ mins }) => (<span className="mx-2">{ mins || '?' } mi</span>)

export const VenueDisplay = ({ bookingId }: VenueDisplayProps) => {
  const bookingDict = useRecoilValue(bookingDictSelector)
  const venueDict = useRecoilValue(venueDictSelector)
  const distanceDict = useRecoilValue(distanceDictSelector)

  if (!bookingId) return null

  const booking = bookingDict[bookingId]
  const venue = venueDict[booking.VenueId]

  const options = distanceDict[booking.Date]
  const distance = options.option?.filter((o) => o.VenueId === venue.Id)[0]

  return (
    <div className="grid grid-cols-7">

      <div className="col-span-5">{ venue ? venue.Name : 'No Venue' }</div>
      <div className="col-span-1 mx-2 whitespace-nowrap text-center">
        <FontAwesomeIcon icon={faCar} className='opacity-50'/>
        <br />
        { distance.Miles ? distance.Miles + 'm' : 'N/A' }</div>
      <div className="col-span-1 mx-2 whitespace-nowrap text-center">
        <FontAwesomeIcon icon={faClock} className='opacity-50'/>
        <br />
        { distance.Mins ? distance.Mins + 'm' : 'N/A' }</div>
    </div>
  )
}
