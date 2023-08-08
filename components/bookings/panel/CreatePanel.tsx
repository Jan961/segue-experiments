/* eslint-disable no-unused-vars */
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { viewState } from 'state/booking/viewState'
import { useRecoilState, useRecoilValue } from 'recoil'
import { bookingState } from 'state/booking/bookingState'
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
import { faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons'
import { GapPanel } from './GapPanel'
import { findPrevAndNextBookings } from './utils/findPrevAndNextBooking'
import { VenueWithDistance } from 'pages/api/venue/read/distance'
import { GapChoicePanel } from './GapChoicePanel'

enum PanelMode {
  Start = 0,
  Booking = 1,
  Peformance = 2,
  Gifu = 3,
  Other = 4,
  Gap = 5,
  GapChoice = 6,
}

export default function CreatePanel () {
  const bookingDict = useRecoilValue(bookingState)
  const { selectedDate } = useRecoilValue(viewState)
  const venueDict = useRecoilValue(venueState)
  const schedule = useRecoilValue(scheduleSelector)
  const [rehearsalDict, setRehearsalDict] = useRecoilState(rehearsalState)

  const [mode, setMode] = React.useState<PanelMode>(PanelMode.Start)
  const [bookingId, setBookingId] = React.useState<number>(undefined)
  const [gapVenues, setGapVenues] = React.useState<VenueWithDistance[]>([])

  const commonButtonClasses = 'w-full p-4 mb-4'

  const closestBookingIds = findClosestBooking(bookingDict, selectedDate)
  const closestBookings = closestBookingIds.map(id => bookingDict[id])

  const { prevBookings, nextBookings } = findPrevAndNextBookings(bookingDict, selectedDate)

  React.useEffect(() => {
    reset()
  }, [selectedDate])

  const reset = () => {
    setBookingId(undefined)
    setGapVenues(undefined)
    setMode(PanelMode.Start)
  }

  const setGapVenueIds = (venues: VenueWithDistance[]) => {
    setMode(PanelMode.GapChoice)
    setGapVenues(venues)
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

  if (mode === PanelMode.Gap) {
    return (
      <GapPanel reset={reset} setGapVenueIds={setGapVenueIds} />
    )
  }

  if (mode === PanelMode.GapChoice) {
    return (
      <GapChoicePanel reset={reset} gapVenues={gapVenues} />
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
      <FormInputButton
        className={commonButtonClasses}
        text="Gap Suggest"
        disabled={!prevBookings.length || !nextBookings.length}
        icon={faMagicWandSparkles}
        onClick={() => setMode(PanelMode.Gap)} />
      <div className="grid grid-cols-2 gap-2">
        <FormInputButton className={commonButtonClasses} text="Booking" onClick={() => setMode(PanelMode.Booking)} />
        <FormInputButton className={commonButtonClasses} text="Rehearsal" onClick={createRehearsal}/>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <FormInputButton className={commonButtonClasses} text="Other" onClick={() => setMode(PanelMode.Other)} />
        <FormInputButton className={commonButtonClasses} text="Get In Fit Up" onClick={() => setMode(PanelMode.Gifu)} />
      </div>
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
