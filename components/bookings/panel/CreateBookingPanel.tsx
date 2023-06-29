import axios from 'axios'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { CreateBookingsParams } from 'pages/api/bookings/create'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import { VenueSelector } from './components/VenueSelector'
import { getDateBlockId } from './utils/getDateBlockId'
import { viewState } from 'state/booking/viewState'
import { bookingState } from 'state/booking/bookingState'

interface CreateBookingPanelProps {
  reset: () => void
}

export const CreateBookingPanel = ({ reset }: CreateBookingPanelProps) => {
  const [venueId, setVenueId] = React.useState<number>(undefined)
  const { selectedDate } = useRecoilValue(viewState)
  const [bookingDict, setBookingDict] = useRecoilState(bookingState)
  const schedule = useRecoilValue(scheduleSelector)
  const DateBlockId = getDateBlockId(schedule, selectedDate)

  const createBooking = async () => {
    const newDate: CreateBookingsParams = { DateBlockId, Date: selectedDate, VenueId: venueId }
    const { data } = await axios.post('/api/bookings/create', newDate)
    const newState = { ...bookingDict, [data.Id]: data }
    setBookingDict(newState)
    cancel()
  }

  const cancel = () => {
    setVenueId(undefined)
    reset()
  }

  return (
    <>
      <h3 className='text-lg mb-2 text-center'>Booking</h3>
      <div className="p-4 pb-px mb-4 rounded-lg bg-primary-blue">
        <VenueSelector venueId={venueId} onChange={(e) => setVenueId(parseInt(e.target.value))} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <FormInputButton onClick={cancel} text="Cancel" />
        <FormInputButton onClick={createBooking} disabled={!venueId} intent="PRIMARY" text="Create" />
      </div>
    </>
  )
}