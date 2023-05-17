import React, { useEffect, useState } from 'react'
import { dateService } from 'services/dateService'
import axios from 'axios'
import { loggingService } from 'services/loggingService'
import { StyledDialog } from 'components/global/StyledDialog'
import { ToolbarButton } from '../ToolbarButton'

interface BookingHoldProps {
  TourID: null
}

export default function BookingHold ({ TourId }: BookingHoldProps) {
  const [showModal, setShowModal] = React.useState(false)
  const [datesList, getDatesList] = React.useState([])
  const [performanceList, setPerformanceList] = useState([])

  const [inputs, setInputs] = useState({
    BookingId: 0,
    Performance: 0,
    Seats: 0,
    Notes: ''
  })
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  })

  useEffect(() => {
    // Get Saleable Bookings
    fetch(`/api/bookings/saleable/${TourId}`)
      .then((res) => res.json())
      .then((dates) => {
        getDatesList(dates)
      })
  }, [TourId])

  async function handleOnSubmit (e) {
    e.preventDefault()
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }))
    await axios({
      method: 'POST',
      url: '/api/bookings/holds/bookingHold/create',
      data: inputs
    }).then((response) => {
      loggingService.logAction('Create Hold', 'Update Add Hold ')
    }).catch((error) => {
      loggingService.logError(error)
    })

    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null }
    })
  };

  async function handleOnChange (e) {
    e.persist()

    if (e.target.name === 'BookingId') {
      await fetch(`/api/bookings/Performances/${e.target.value}`)
        .then((res) => res.json())
        .then((times) => {
          setPerformanceList(times)
        })
    }

    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  return (
    <>
      <ToolbarButton onClick={() => setShowModal(true)}>Booking Holds</ToolbarButton>
      <StyledDialog title="Booking Holds" open={showModal} onClose={() => setShowModal(false) }>
        <form onSubmit={handleOnSubmit}>
          <div className="flex flex-row">
            <p className={'text-center p-10 h-15'}>
          Create a Hold
            </p>
          </div>

          <div className="flex flex-row">
            <label htmlFor="date" className="">Seats</label>
            <input
              className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={inputs.Seats}
              id="Seats"
              name="Seats"
              type="number"
              required
              onChange={handleOnChange}
            />

          </div>

          <div className="flex flex-row">
            <label htmlFor="date" className="">Notes</label>
            <textarea className="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              id="Notes"
              name="Notes"
              required
              onChange={handleOnChange}
            >
              {inputs.Notes}
            </textarea>

          </div>

          <div className="flex flex-row">
            <label htmlFor="venueDistance" className="">Associate With booking</label>

            <select
              name={'BookingId'}
              id={'BookingId'}
              onChange={handleOnChange}
            >

              {datesList.length > 0

                ? datesList.map((date) => (
                  <>
                    <option value={date.BookingId}>{dateService.getWeekDay(date.ShowDate)} {dateService.dateStringToSimple(date.ShowDate)} </option>
                  </>
                ))
                : <option value={''}>Tour has no dates</option>
              }

            </select>

          </div>

          <div className="flex flex-row">
            <label htmlFor="venueDistance" className="">Associate With Perfomance</label>

            <select
              name={'Performance'}
              id={'Performance'}
              onChange={handleOnChange}
            >
              {performanceList.length > 0
                ? <>
                  <option value={0}>All</option>
                </>
                : null
              }

              {performanceList.length > 0

                ? performanceList.map((time) => (
                  <option value={time.PerformanceId} id={time.PerformanceId}>{time.Time.substring(11, 16)} </option>

                ))
                : <option value={''}>Tour has no performances</option>
              }
            </select>
          </div>
          <StyledDialog.FooterContainer>
            <StyledDialog.FooterCancel onClick={() => setShowModal(false)} />
            <StyledDialog.FooterContinue submit>Create Hold</StyledDialog.FooterContinue>
          </StyledDialog.FooterContainer>
        </form>
      </StyledDialog>
    </>
  )
}
