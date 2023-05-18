import VenueInfo from './modal/VenueInfo'
import ViewBookingHistory from './modal/ViewBookingHistory'
import PerfomancesList from './perfomancesList'
import React from 'react'
import axios from 'axios'
import { venueState } from 'state/venueState'
import { useRecoilState, useRecoilValue } from 'recoil'
import { dayTypeState } from 'state/dayTypeState'
import { bookingState } from 'state/bookingState'
import { FormInputSelect } from 'components/global/forms/FormInputSelect'
import { bookingDictSelector } from 'state/selectors/bookingDictSelector'
import { FormInputTextAttached } from 'components/global/forms/FormInputSetter'
import { dateService } from 'services/dateService'
import ChangeBookingDate from './modal/ChangeBookingDate'

interface InfoPanelProps {
  selectedBooking: number;
  setSelectedBooking: (id: number) => void
}

export const InfoPanel = ({ selectedBooking, setSelectedBooking }: InfoPanelProps) => {
  const venues = useRecoilValue(venueState)
  const dayTypes = useRecoilValue(dayTypeState)
  const bookings = useRecoilValue(bookingState)
  const [bookingDict, updateBooking] = useRecoilState(bookingDictSelector)
  const [inputs, setInputs] = React.useState(null)

  const booking = bookingDict[selectedBooking]

  const nextBookingId = React.useMemo(() => {
    let next = false

    for (const booking of bookings) {
      if (next === true) return booking.BookingId
      if (booking.BookingId === selectedBooking) {
        next = true
      }
    }
  }, [bookings, selectedBooking])

  React.useEffect(() => {
    const existing = bookingDict[selectedBooking]

    // Commented out are not saved on backend? Should be simply displaying?
    const newInputs = {
      BookingId: existing.BookingId,
      // ShowDate: existing.ShowDate,
      VenueId: existing.VenueId || null,
      // Capacity: existing.Venue?.Seats,
      DayTypeCast: existing.DayTypeCast,
      LocationCast: existing.LocationCast,
      DayTypeCrew: existing.DayTypeCrew || 1,
      LocationCrew: existing.LocationCrew,
      BookingStatus: existing.BookingStatus || 'U',
      // RunDays: existing.RunDays || 1,
      // Pencil: existing.Pencil || 0,
      // Notes: existing.Notes || '',
      // PerformancesPerDay: existing.PerformancesPerDay,
      // Performance1: existing.Venue?.Seats || 0,
      // Performance2: existing.Venue?.Seats || 0
    }

    setInputs(newInputs)
  }, [selectedBooking, bookings, setInputs])

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

  const handleOnChange = (e) => {
    e.persist()

    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const saveAndNext = async (e) => {
    e.preventDefault()
    saveDetails()
    setSelectedBooking(nextBookingId)
  }

  const changeCapacity = async (e) => {
    e.preventDefault()
  }

  if (!inputs) return null

  const venueOptions = [{ text: 'Please Select a Venue', value: '' }, ...venues.map(x => ({ text: x.Name, value: String(x.VenueId) }))]

  return (
    <div className="w-6/12 pl-4" >
      <form>
        <div className="bg-primary-blue rounded-xl flex flex-col justify-center mb-4 p-4 pb-0">
          <ChangeBookingDate bookingId={booking.BookingId} />
          <FormInputSelect name="VenueId" value={inputs.VenueId ? inputs.VenueId : ''} options={venueOptions} onChange={handleOnChange} />
        </div>

        <div className="flex flex-row h-10 items-center mb-4">
          <label
            htmlFor="Capacity"
            className="flex-auto text-primary-blue font-bold text-sm self-center"
          >
                                        Capacity:
          </label>

          <input
            className="block w-full min-w-0 flex-1 rounded-none rounded-l-md rounded-r-md border-gray-300 px-3 py-2 mr-4 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-4/5"
            value={inputs.Capacity}
            id="Capacity"
            name="Capacity"
            type="text"

            onChange={handleOnChange}
          />
          <button
            className="inline-flex items-center rounded-md border border-transparent bg-primary-blue px-8 py-1 text-xs font-normal leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 h-4/5"
            onClick={changeCapacity}
          >
                                        Change
          </button>
        </div>

        <div className="flex flex-row mb-4">
          <label
            htmlFor="dayTypeCast"
            className="flex-auto text-primary-blue font-bold text-sm self-center"
          >
                                        Day Type: (crew)
          </label>

          <select className="flex flex-auto h-4/5 rounded-l-md rounded-r-md text-xs"
            onChange={handleOnChange}
            value={inputs.DayTypeCrew}
            name={'DayTypeCrew'}
            id={'DayTypeCrew'}
          >
            <option >Please Select a Day Type</option>
            { dayTypes.map((dayType) => (
              <option key={dayType.DateTypeId} value={dayType.DateTypeId}>{dayType.Name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-row mr-0">
          <label htmlFor="crewDetails" className="sr-only">
                                        crew Details
          </label>
          <input
            type="text"
            value={inputs.LocationCrew}
            id="LocationCrew"
            name="LocationCrew"
            onChange={handleOnChange}
            className="flex flex-auto w-1/2 h-4/5 rounded-l-md rounded-r-md text-xs ml-auto mr-0"
          />
        </div>

        <div className="flex flex-row">
          <label
            htmlFor="dayTypecrew"
            className="flex-auto text-primary-blue font-bold text-sm self-center"
          >
                                        Day Type: (cast)
          </label>

          <select className="flex flex-auto m-3 h-4/5 rounded-l-md rounded-r-md text-xs mr-0"
            onChange={handleOnChange}
            id="DayTypeCast"
            name="DayTypeCast"

            value={inputs.DayTypeCast}>
            <option >Please Select a Day Type</option>
            {dayTypes.map((dayType) => (
              <option key={dayType.DateTypeId} value={dayType.DateTypeId}>{dayType.Da}{dayType.Name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-row">
          <label htmlFor="LocationCrew" className="sr-only">
                                        crew Details
          </label>
          <input
            type="text"
            id="CastLocation"
            name="CastLocation"
            onChange={handleOnChange}
            value={inputs.CastLocation}
            className="flex flex-auto w-1/2 h-4/5 rounded-l-md rounded-r-md text-xs ml-auto mr-0"
          />
        </div>
        <div className="flex flex-row">
          <label
            htmlFor="BookingStatus"
            className="flex-auto text-primary-blue font-bold text-sm self-center"
          >
                                        Venue Status:
          </label>
          <select className="flex flex-auto m-3 mb-1 mr-0 rounded-l-md rounded-r-md text-xs"
            value={inputs.BookingStatus}
            onChange={handleOnChange}
            id="BookingStatus"
            name="BookingStatus"

          >
            <option value={'C'}>Confirmed (C)</option>
            <option value={'U'}>Unconfirmed (U)</option>
            <option value={'X'}>Canceled (X)</option>
          </select>
        </div>
        <div className="flex flex-row">
          <label
            htmlFor="runDays"
            className="flex-auto text-primary-blue font-bold text-sm self-center"
          >
                                        Run Days:
          </label>
          <select className="flex flex-auto m-3 rounded-l-md rounded-r-md text-xs"
            value={inputs.RunDays}
            onChange={handleOnChange}
            id="RunDays"
            name="RunDays">
            <option value={1}>{1}</option>
            <option value={2}>{2}</option>
            <option value={3}>{2}</option>
            <option value={4}>{4}</option>
            <option value={5}>{5}</option>
            <option value={6}>{6}</option>
            <option value={6}>{7}</option>
            <option value={8}>{8}</option>
            <option value={9}>{9}</option>
            <option value={10}>{10}</option>
            <option value={11}>{11}</option>
            <option value={12}>{12}</option>
            <option value={13}>{13}</option>
            <option value={14}>{14}</option>
            <option value={15}>{15}</option>
            <option value={16}>{16}</option>
            <option value={17}>{17}</option>
            <option value={18}>{18}</option>
            <option value={19}>{19}</option>
            <option value={20}>{20}</option>

          </select>
          <label
            htmlFor="venuStatus"
            className="flex-auto text-primary-blue font-bold text-sm self-center"
          >
                                        Pencil #:
          </label>
          <select className="flex flex-auto m-3 mr-0 rounded-l-md rounded-r-md text-xs"
            value={inputs.PencilNo}
            onChange={handleOnChange}
            id="PencilNo"
            name="PencilNo">
            <option value={1}>{1}</option>
            <option value={2}>{2}</option>
            <option value={3}>{2}</option>
          </select>
        </div>
        <div className="flex flex-row">
          <label
            htmlFor="notes"
            className="flex-auto text-primary-blue font-bold text-sm self-center"
          ></label>
          <textarea
            id="Notes"
            name="Notes"
            onChange={handleOnChange}
            className="flex-auto rounded-l-md rounded-r-md w-full mb-1"
          >{inputs.Notes}</textarea>
        </div>

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

        <div className="flex flex-row">
          <label
            htmlFor="notes"
            className="flex-auto text-primary-blue font-bold text-sm self-center"
          >
            Performances:
          </label>

        </div>

        <PerfomancesList bookingId={selectedBooking}></PerfomancesList>

        <div className="flex flex-row justify-between mt-4">
          <VenueInfo VenueId={inputs.VenueId}></VenueInfo>
          <ViewBookingHistory VenueId={inputs.VenueId}></ViewBookingHistory>
        </div>

        <div className="flex flex-row mt-1">
          <p className="text-xs">Travel from previous venue: {}</p>
        </div>
        <div className="flex flex-row">
          <p className="text-xs">{}</p>
        </div>
      </form>
    </div>
  )
}