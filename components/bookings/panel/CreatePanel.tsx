import { FormInputButton } from 'components/global/forms/FormInputButton'
import { viewState } from 'state/booking/viewState'
import { useRecoilState, useRecoilValue } from 'recoil'
import { bookingState } from 'state/booking/bookingState'
import { BookingDTO } from 'interfaces'
import { venueState } from 'state/booking/venueState'
import axios from 'axios'
import { ScheduleViewModel, scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import { CreateBookingsParams } from 'pages/api/bookings/create'
import React from 'react'
import { VenueSelector } from './components/VenueSelector'

const getDateBlockId = (schedule: ScheduleViewModel, dateToFind: string): number => {
  for (const section of schedule.Sections) {
    for (const date of section.Dates) {
      if (date.Date === dateToFind) {
        return section.Id
      }
    }
  }
  return undefined
}

const findClosestBooking = (bookings: Record<number, BookingDTO>, specifiedDate: string) => {
  let closestDate: string = '1970-01-01' // Allow initial comparisons
  let closestBookings: number[] = []

  const keys = Object.keys(bookings)

  // Go through each booking in the associative array
  for (const key of keys) {
    const bDate = bookings[key].Date.split('T')[0]
    const id = bookings[key].Id

    if (bDate <= specifiedDate) {
      // Get the more recent event that is before the date
      if (bDate > closestDate) {
        closestDate = bDate
        closestBookings = [id]
      } else if (bDate === closestDate) {
        closestBookings.push(id)
      }
    }
  }
  return closestDate ? closestBookings : undefined
}

enum PanelMode {
  Start = 0,
  Booking = 1,
}

export default function AddBooking () {
  const [bookingDict, setBookingDict] = useRecoilState(bookingState)
  const { selectedDate } = useRecoilValue(viewState)
  const venueDict = useRecoilValue(venueState)
  const schedule = useRecoilValue(scheduleSelector)
  const [venueId, setVenueId] = React.useState<number>(undefined)
  const [mode, setMode] = React.useState<PanelMode>(PanelMode.Start)

  const commonButtonClasses = 'w-full p-4 text-lg mb-4'

  const closestBookingIds = findClosestBooking(bookingDict, selectedDate)
  const closestBookings = closestBookingIds.map(id => bookingDict[id])

  const createBooking = async () => {
    const DateBlockId = getDateBlockId(schedule, selectedDate)
    const newDate: CreateBookingsParams = { DateBlockId, Date: selectedDate, VenueId: venueId }
    const { data } = await axios.post('/api/bookings/create', newDate)
    const newState = { ...bookingDict, [data.Id]: data }
    setBookingDict(newState)
    reset()
  }

  const reset = () => {
    setMode(PanelMode.Start)
    setVenueId(undefined)
  }

  if (mode === PanelMode.Booking) {
    return (
      <>
        <div className="p-4 pb-px mb-4 rounded-lg bg-primary-blue">
          <VenueSelector venueId={venueId} onChange={(e) => setVenueId(parseInt(e.target.value))} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <FormInputButton onClick={reset} text="Cancel" />
          <FormInputButton onClick={createBooking} intent="PRIMARY" text="Create" />
        </div>
      </>
    )
  }

  return (
    <div className='m-2 mt-4 mb-0'>
      <FormInputButton className={commonButtonClasses} text="Booking" onClick={() => setMode(PanelMode.Booking)} />
      <FormInputButton className={commonButtonClasses} text="Rehearsal" />
      { !closestBookingIds.length && (<FormInputButton className={commonButtonClasses} disabled text="Performance" />)}
      { closestBookings.map(({ Id, VenueId }) =>
        <FormInputButton key={Id}
          className={commonButtonClasses}
          text={`Performance: ${venueDict[VenueId].Name}`} />
      )
      }
    </div>
  )
}
