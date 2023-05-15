import React, { useEffect, useState } from 'react'
import { dateService } from 'services/dateService'
import { userService } from 'services/user.service'
import axios from 'axios'
import { loggingService } from 'services/loggingService'
import { ToolbarButton } from '../ToolbarButton'
import { StyledDialog } from 'components/global/StyledDialog'
import { useRecoilValue } from 'recoil'
import { venueState } from 'state/venueState'
import { dayTypeState } from 'state/dayTypeState'

interface AddBookingProps {
    BookingId: number,
}

export default function AddBooking (BookingId : AddBookingProps) {
  const [showModal, setShowModal] = React.useState(false)
  const venues = useRecoilValue(venueState)
  const dayTypes = useRecoilValue(dayTypeState)

  const [previousDistance, setPreviousDistance] = useState({
    VenueID: null, Venue2Id: null, Mileage: null, TimeMins: null
  })
  const [nextDistance, setNextDistance] = useState({
    VenueID: null, Venue2Id: null, Mileage: null, TimeMins: null
  })
  const [isBarred, setIsBarred] = useState(false)
  const [barringCheck, setBarringCheck] = React.useState(false)
  const [inputs, setInputs] = useState({
    ShowDate: dateService.formDate(new Date()),
    VenueId: 0,
    Capacity: 0,
    DayTypeCast: null,
    CastLocation: null,
    DayTypeCrew: null,
    LocationCrew: null,
    BookingStatus: null,
    RunDays: null,
    PencilNo: null,
    Notes: null,
    PerformancePerDay: null,
    Performance1: null,
    Performance2: null,
    BookingId

  })

  useEffect(() => {
    fetch(`/api/bookings/booking/${BookingId.BookingId}`)
      .then((res) => res.json())
      .then((response) => {
        if (response !== null) {
          const VenueId = response.VenueId !== null ? response.Venue.VenueId : null
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
  }, [BookingId.BookingId])

  function handleOnSubmit (e) {
    e.preventDefault()
    alert('save')
    axios({
      method: 'POST',
      url: '/api/bookings/update/',
      data: inputs
    })
      .then((response) => {
        loggingService.logAction('Booking Updated', 'Booking wat updated by:' + userService.userValue.userId)
        handleServerResponse(
          true,
          'Thank you, your message has been submitted.'
        )

        handleClose()
      })
      .catch((error) => {
        handleServerResponse(false, error.response.data.error)
      })
  }

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      console.log('ok')
    } else {
      console.log('error')
    }
  }
  function handleClose () {
    setShowModal(false)
  }

  async function handleOnChange (e) {
    e.persist()
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  function handleOnClose () {
    setBarringCheck(false)
    setIsBarred(false)
    setShowModal(false)
  }

  // @ts-ignore
  return (
    <>
      <ToolbarButton onClick={() => setShowModal(true)}>Add Booking</ToolbarButton>

      <StyledDialog open={showModal} onClose={() => setShowModal(false)} title="Add Booking">
        <form onSubmit={handleOnSubmit}>
          <div className="bg-primary-blue rounded-xl flex flex-col justify-center mb-4 ">
            <div className="flex flex-row mx-4 mb-3 mt-1">
              <label htmlFor="Date" className=""></label>
              <h1>{dateService.dateToSimple(inputs.ShowDate)}</h1>
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
                { venues.map((venue) => (
                  <option key={venue.VenueId} value={venue.VenueId}>{venue.Name}</option>
                ))}
              </select>
            </div>
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
              {dayTypes.map((dayType) => (
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
          <div className="flex flex-row">
          </div>
          { previousDistance.Mileage !== null
            ? (
              <>
                <div className="flex flex-row  m-1 p-3" >
                  <p>
                                            Distance from Previous Venue {previousDistance.Mileage} Miles {previousDistance.TimeMins}</p>
                </div>
              </>)
            : null}
          { nextDistance.Mileage !== null
            ? (
              <>
                <div className="flex flex-row  m-1 p-3" >
                  <p>
                                            Distance from Previous Venue {nextDistance.Mileage} Miles {nextDistance.TimeMins}</p>
                </div>
              </>)
            : null}
          { isBarred
            ? (
              <>
                <div className="flex flex-row text-2xl bg-red-700 m-1 p-3" >
                  <p className={'text-cyan-50'}>This venue has has failed barring check, Click Save to accept this exception</p>
                </div>
              </>)
            : (null)}

          {/* footer */}
          <StyledDialog.FooterContainer>
            <StyledDialog.FooterCancel onClick={handleOnClose}>Cancel</StyledDialog.FooterCancel>
            <StyledDialog.FooterContinue submit>Save Booking</StyledDialog.FooterContinue>
          </StyledDialog.FooterContainer>
        </form>
      </StyledDialog>
    </>
  )
}
