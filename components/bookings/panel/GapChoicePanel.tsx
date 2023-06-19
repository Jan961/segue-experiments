import axios from 'axios'
import classNames from 'classnames'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import venueId from 'pages/accounts/venues/edit/[venueId]'
import { CreateBookingsParams } from 'pages/api/bookings/create'
import { VenueWithDistance } from 'pages/api/venue/read/distance'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { bookingState } from 'state/booking/bookingState'
import { VenueState, venueState } from 'state/booking/venueState'
import { viewState } from 'state/booking/viewState'

interface GapChoicePanelRowProps {
  info: VenueWithDistance
  venueDict: VenueState
  setActive: () => void
  active?: boolean
}

const GapChoicePanelRow = ({ info, venueDict, active, setActive }: GapChoicePanelRowProps) => {
  const baseClass = 'p-1 even:bg-gray-100 hover:bg-blue-200 cursor-pointer'

  return (
    <tr onClick={setActive} className={ active ? classNames(baseClass, 'bg-blue-200 even:bg-blue-200') : baseClass }>
      <td className='px-1'>{venueDict[info.VenueId].Name}</td>
      <td className='px-1'>{info.MileageFromEnd}</td>
      <td className='px-1'>{info.MileageFromStart}</td>
    </tr>
  )
}

interface GapChoicePanelProps {
  reset: () => void
  gapVenues: VenueWithDistance[]
}

export const GapChoicePanel = ({ reset, gapVenues }: GapChoicePanelProps) => {
  const venueDict = useRecoilValue(venueState)
  const [bookingDict, setBookingDict] = useRecoilState(bookingState)
  const { selectedDate } = useRecoilValue(viewState)
  const [selectedVenue, setSelectedVenue] = React.useState<number>(undefined)
  const cancel = () => {
    reset()
  }

  const sorted = gapVenues.sort((a, b) => (a.MileageFromStart + a.MileageFromEnd) - (b.MileageFromStart + b.MileageFromEnd));

  const createBooking = async () => {
    const newDate: CreateBookingsParams = { DateBlockId, Date: selectedDate, VenueId: selectedVenue }
    const { data } = await axios.post('/api/bookings/create', newDate)
    const newState = { ...bookingDict, [data.Id]: data }
    setBookingDict(newState)
    cancel()
  }

  return (
    <>
      <h3 className='text-lg mb-2 text-center'>Gap Suggest</h3>

      <div className="max-h-80 overflow-y-scroll border mb-2">
        <table className="text-xs">
          { sorted.map((x) =>
            <GapChoicePanelRow
              key={x.VenueId}
              venueDict={venueDict}
              info={x}
              active={selectedVenue === x.VenueId}
              setActive={() => setSelectedVenue(x.VenueId)}
            />) }
        </table>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <FormInputButton onClick={cancel} text="Cancel" />
        <FormInputButton onClick={createBooking} disabled={!selectedVenue} intent="PRIMARY" text="Create" />
      </div>
    </>
  )
}
