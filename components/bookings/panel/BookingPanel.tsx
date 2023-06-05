import VenueInfo from '../modal/VenueInfo'
import ViewBookingHistory from '../modal/ViewBookingHistory'
import React from 'react'
import axios from 'axios'
import { venueState } from 'state/booking/venueState'
import { useRecoilState, useRecoilValue } from 'recoil'
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect'
import { bookingDictSelector } from 'state/booking/selectors/bookingDictSelector'
import { ChangeBookingDate } from '../modal/ChangeBookingDate'
import { FormInputText } from 'components/global/forms/FormInputText'
import { viewState } from 'state/booking/viewState'
import { bookingState } from 'state/booking/bookingState'
import { BookingDTO } from 'interfaces'

const getNextBookingId = (bookings: BookingDTO[], current: number) => {
  let found = false
  for (const b of bookings) {
    if (found) return b.Id
    if (current === b.Id) found = true
  }
  return undefined
}

interface BookingPanelProps {
  bookingId: number
}

export const BookingPanel = ({ bookingId }: BookingPanelProps) => {
  const defaultState: any = {}
  const venues = useRecoilValue(venueState)
  const [bookingDict, updateBooking] = useRecoilState(bookingDictSelector)
  const bookings = useRecoilValue(bookingState)
  const [inputs, setInputs] = React.useState(defaultState)
  const booking = bookingDict[bookingId]

  const nextBookingId = getNextBookingId(bookings, bookingId)
  /*
  const nextBookingId = React.useMemo(() => {
    console.log('useMemo')
    let next = false

    for (const booking of bookings) {
      if (next === true) return booking.Id
      if (booking.Id === selectedBooking) {
        next = true
      }
    }
  }, [bookings, selectedBooking])
  */

  React.useEffect(() => {
    if (!booking) {
      setInputs({})
      return
    }
    // Commented out are not saved on backend? Should be simply displaying?
    const newInputs = {
      BookingId: booking.Id,
      // ShowDate: existing.ShowDate,
      VenueId: booking.VenueId || null,
      // Capacity: existing.Venue?.Seats,
      /*
      DayTypeCast: booking.DayTypeCast,
      LocationCast: booking.LocationCast,
      DayTypeCrew: booking.DayTypeCrew || 1,
      LocationCrew: booking.LocationCrew,
      BookingStatus: booking.BookingStatus || 'U'
      */
      // RunDays: existing.RunDays || 1,
      // Pencil: existing.Pencil || 0,
      // Notes: existing.Notes || '',
      // PerformancesPerDay: existing.PerformancesPerDay,
      // Performance1: existing.Venue?.Seats || 0,
      // Performance2: existing.Venue?.Seats || 0
    }

    setInputs(newInputs)
  }, [booking])

  if (!booking) return (<div className="w-6/12 pl-4" />)

  const saveDetails = async () => {
    const response = await axios({
      method: 'POST',
      url: '/api/bookings/update/',
      data: inputs
    })

    const updated = response.data

    // Can't find a a way to do this automatically, we need Date objects for typescript
    updated.ShowDate = new Date(updated.ShowDate)

    updateBooking(updated)
  }

  const save = async (e) => {
    e.preventDefault()
    saveDetails()
  }

  const handleOnChange = (e: any) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const saveAndNext = async (e: any) => {
    e.preventDefault()
    saveDetails()
  }

  const venueOptions: SelectOption[] = [{ text: 'Please Select a Venue', value: '' }, ...venues.map(x => ({ text: x.Name, value: String(x.Id) }))]
  const statusOptions: SelectOption[] = [
    { text: 'Confirmed (C)', value: 'C' },
    { text: 'Unconfirmed (U)', value: 'U' },
    { text: 'Canceled (X)', value: 'X' }
  ]

  return (

    <form>
      <div className="bg-primary-blue rounded-lg flex flex-col justify-center mb-4 p-4 pb-0">
        <ChangeBookingDate bookingId={booking.Id} />
        <FormInputSelect name="VenueId" value={inputs.VenueId ? inputs.VenueId : ''} options={venueOptions} onChange={handleOnChange} />
      </div>
      <FormInputText
        value={inputs.LocationCrew}
        name="LocationCrew"
        onChange={handleOnChange}
        placeholder="Crew details"
      />
      <FormInputText
        value={inputs.LocationCast}
        name="LocationCast"
        onChange={handleOnChange}
        placeholder="Cast details"
      />
      <FormInputSelect inline
        value={inputs.StatusCode}
        onChange={handleOnChange}
        options={statusOptions}
        name="StatusCode"
        label="Status"
      />
      <div className="flex flex-row justify-between">
        <button className="inline-flex items-center justify-center w-2/5 rounded-md border border-primary-blue
                  bg-white px-2 py-2 text-xs font-medium leading-4 text-primary-blue shadow-sm hover:bg-indigo-700
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-5 m-2 ml-0"
        onClick={save}
        >
            Save
        </button>
        <button className="inline-flex items-center justify-center w-3/5 rounded-md border border-transparent
                  bg-primary-blue px-2 py-2 text-xs font-medium leading-4 text-white shadow-sm hover:bg-indigo-700
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 p-5 m-2 mr-0"
        onClick={saveAndNext}
        disabled={!nextBookingId}
        >
            Save & go to next
        </button>
      </div>

      <div className="flex flex-row justify-between mt-4">
        <VenueInfo VenueId={inputs.VenueId}></VenueInfo>
        <ViewBookingHistory VenueId={inputs.VenueId}></ViewBookingHistory>
      </div>

    </form>
  )
}
