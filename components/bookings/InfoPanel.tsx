import VenueInfo from './modal/VenueInfo'
import ViewBookingHistory from './modal/ViewBookingHistory'
import PerfomancesList from './perfomancesList'
import React, { useEffect } from 'react'
import { dateService } from 'services/dateService'
import axios from 'axios'
import { venueState } from 'state/venueState'
import { useRecoilValue } from 'recoil'
import { dayTypeState } from 'state/dayTypeState'

interface InfoPanelProps {
  selectedBooking: number;
  setSelectedBooking: (id: number) => void
}

export const InfoPanel = ({ selectedBooking, setSelectedBooking }: InfoPanelProps) => {
  const venues = useRecoilValue(venueState)
  const dayTypes = useRecoilValue(dayTypeState)

  const [inputs, setInputs] = React.useState({
    ShowDate: dateService.formDate(new Date()),
    VenueId: null,
    Capacity: 0,
    DayTypeCast: '',
    CastLocation: null,
    DayTypeCrew: '',
    LocationCrew: null,
    BookingStatus: 'U',
    RunDays: '',
    PencilNo: '',
    Notes: '',
    PerformancePerDay: 0,
    Performance1: '',
    Performance2: '',
    BookingId: 0
  })

  useEffect(() => {
    fetch(`/api/bookings/booking/${selectedBooking}`)
      .then((res) => res.json())
      .then((response) => {
        if (response !== null) {
          const VenueId = response.VenueId !== null ? response.Venue.VenueId : 0
          const Capacity = response.Venue !== null ? response.Venue.Seats : 0
          const DayTypeCast = response.DayTypeCast !== null ? response.DayTypeCast : 1
          const CastLocation = response.CastLocation !== null ? response.CastLocation : null
          const DayTypeCrew = response.DayTypeCrew !== null ? response.DayTypeCrew : 1
          const LocationCrew = response.LocationCrew !== null ? response.LocationCrew : null
          const BookingStatus = response.BookingStatus !== null ? response.BookingStatus : 'U'
          const RunDays = response.RunDays !== null ? response.RunDays : 1
          const PencilNo = response.PencilNo !== null ? response.PencilNo : 0
          const Notes = response.Notes !== null ? response.Notes : ''
          const PerformancePerDay = response.PerformancePerDay !== null ? response.PerformancePerDay : 0
          const Performance1 = response.Venue !== null ? response.Venue.Seats : 0
          const Performance2 = response.Venue !== null ? response.Venue.Seats : 0

          setInputs({
            ShowDate: dateService.formDate(response.ShowDate),
            VenueId,
            Capacity,
            DayTypeCast,
            CastLocation,
            DayTypeCrew,
            LocationCrew,
            BookingStatus,
            RunDays,
            PencilNo,
            Notes,
            PerformancePerDay,
            Performance1,
            Performance2,
            BookingId: response.BookingId

          })
        }
      })
  }, [selectedBooking])

  const saveDetails = async () => {
    await axios({
      method: 'POST',
      url: '/api/bookings/update/',
      data: inputs
    })
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
    setSelectedBooking(selectedBooking + 1)
  }

  const changeCapacity = async (e) => {
    e.preventDefault()
  }

  return (
    <div className="w-6/12 p-4 border-4" >
      <form className={'sticky top-0'}>
        <div className="bg-primary-blue rounded-xl flex flex-col justify-center mb-4 ">
          <div className="flex flex-row mx-4 mt-3 mb-1">
            <label htmlFor="date" className=""></label>
            <input
              className="block w-full min-w-0 flex-1 rounded-none rounded-l-md rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={inputs.ShowDate}
              id="Date"
              name="Date"
              type="date"
              required
              onChange={handleOnChange}
            />

          </div>
          <div className="flex flex-row mx-4 mb-3 mt-1">
            <label htmlFor="venueName" className=""></label>
            <select
              id="VenueId"
              name="VenueId"
              className="block w-full min-w-0 flex-1 rounded-none rounded-l-md rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={handleOnChange}
              value={inputs.VenueId}
            >
              <option >Please Select a Venue</option>
              {venues.map((venue) => (
                <option key={venue.VenueId} value={venue.VenueId}>{venue.Name}</option>
              ))}
            </select>
          </div>
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
