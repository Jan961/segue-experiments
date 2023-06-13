/* eslint-disable no-unused-vars */
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { viewState } from 'state/booking/viewState'
import { useRecoilState, useRecoilValue } from 'recoil'
import { bookingState } from 'state/booking/bookingState'
import { BookingDTO, RehearsalDTO } from 'interfaces'
import { venueState } from 'state/booking/venueState'
import { scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import React from 'react'
import { CreatePerformancePanel } from './CreatePerformancePanel'
import { CreateBookingPanel } from './CreateBookingPanel'
import { findClosestBooking } from './utils/findClosestBooking'
import { CreateGifuPanel } from './CreateGifuPanel'
import { CreateOtherPanel } from './CreateOtherPanel'
import { rehearsalState } from 'state/booking/rehearsalState'
import axios from 'axios'
import { CreateRehearsalParams } from 'pages/api/rehearsals/create'
import { getDateBlockId } from './utils/getDateBlockId'

enum PanelMode {
  Start = 0,
  Booking = 1,
  Peformance = 2,
  Gifu = 3,
  Other = 4,
}

export default function CreatePanel () {
  const bookingDict = useRecoilValue(bookingState)
  const { selectedDate } = useRecoilValue(viewState)
  const venueDict = useRecoilValue(venueState)
  const schedule = useRecoilValue(scheduleSelector)
  const [rehearsalDict, setRehearsalDict] = useRecoilState(rehearsalState)

  const [mode, setMode] = React.useState<PanelMode>(PanelMode.Start)
  const [bookingId, setBookingId] = React.useState<number>(undefined)

  const commonButtonClasses = 'w-full p-4 mb-4'

  const closestBookingIds = findClosestBooking(bookingDict, selectedDate)
  const closestBookings = closestBookingIds.map(id => bookingDict[id])

  const reset = () => {
    setBookingId(undefined)
    setMode(PanelMode.Start)
  }

  if (mode === PanelMode.Peformance) {
    return (
      <CreatePerformancePanel reset={reset} bookingId={bookingId} />
    )
  }

  if (mode === PanelMode.Booking) {
    return (
      <CreateBookingPanel reset={reset} />
    )
  }

  if (mode === PanelMode.Gifu) {
    return (
      <CreateGifuPanel reset={reset} />
    )
  }

  if (mode === PanelMode.Other) {
    return (
      <CreateOtherPanel reset={reset} />
    )
  }

  const createRehearsal = async () => {
    const DateBlockId = getDateBlockId(schedule, selectedDate)
    const newRehearsal: CreateRehearsalParams = { Date: selectedDate, DateBlockId }
    const { data } = await axios.post('/api/rehearsals/create', newRehearsal)
    const newState = { ...rehearsalDict, [data.Id]: data }
    setRehearsalDict(newState)

    reset()
  }

  const createPerformance = (bookingId: number) => {
    setBookingId(bookingId)
    setMode(PanelMode.Peformance)
  }

  return (
    <div className='m-2 mt-4 mb-0'>
      <FormInputButton className={commonButtonClasses} text="Booking" onClick={() => setMode(PanelMode.Booking)} />
      <FormInputButton className={commonButtonClasses} text="Rehearsal" onClick={createRehearsal}/>
      <FormInputButton className={commonButtonClasses} text="Other" onClick={() => setMode(PanelMode.Other)} />
      <FormInputButton className={commonButtonClasses} text="Get In Fit Up" onClick={() => setMode(PanelMode.Gifu)} />
      { !closestBookingIds.length && (<FormInputButton className={commonButtonClasses} disabled text="Performance" />)}
      { closestBookings.map(({ Id, VenueId }) =>
        <FormInputButton key={Id}
          className={commonButtonClasses}
          onClick={() => createPerformance(Id)}
          text={`Performance: ${venueDict[VenueId].Name}`} />
      )
      }
    </div>
  )
}
