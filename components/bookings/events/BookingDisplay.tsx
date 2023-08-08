import { PropsWithChildren } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { timeFormat } from 'services/dateService'
import { bookingState } from 'state/booking/bookingState'
import { distanceDictSelector } from 'state/booking/selectors/distanceDictSelector'
import { venueState } from 'state/booking/venueState'
import { viewState } from 'state/booking/viewState'

interface VenueDisplayProps {
  bookingId: number
  date: string
  performanceCount: number;
}

export const BookingDisplay = ({ bookingId, performanceCount, date }: PropsWithChildren<VenueDisplayProps>) => {
  const bookingDict = useRecoilValue(bookingState)
  const venueDict = useRecoilValue(venueState)
  const distanceDict = useRecoilValue(distanceDictSelector)
  const [view, setView] = useRecoilState(viewState)

  if (!bookingId) return null

  const booking = bookingDict[bookingId]
  if (!booking) return null

  const venue = venueDict[booking.VenueId]

  const options = distanceDict[booking.Date]
  const distance = options?.option?.filter((o) => o.VenueId === venue.Id)[0]

  const first = booking.Date.startsWith(date)

  const select = () => {
    setView({ ...view, selected: { type: 'booking', id: bookingId }, selectedDate: date })
  }

  const active = view.selected?.id === bookingId && view.selected?.type === 'booking' && date.startsWith(view.selectedDate)

  return (
    <div className={`grid grid-cols-10 p-1 px-2 rounded border border-l-8
    text-center
    border-gray-300 bg-gray-50 bg-opacity-50
    ${active ? 'border-gray-400 bg-gray-300 shadow bg-opacity-100' : 'hover:bg-opacity-100 hover:bg-gray-200'}
    `}
    onClick={select}>
      <div className="col-span-7 text-center">
        { venue ? venue.Name : 'No Venue' }
      </div>
      <div className="col-span-1">
        { performanceCount }
      </div>
      <div className="col-span-1 mx-2 whitespace-nowrap">
        { first && distance && (
          <>
            { distance.Miles ? distance.Miles : '' }
          </>
        ) }
      </div>
      <div className="col-span-1 mx-2 whitespace-nowrap">
        { first && distance && (
          <>
            { timeFormat(distance.Mins) }
          </>
        ) }
      </div>
    </div>
  )
}
