import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { dateService } from 'services/dateService'
import { userService } from 'services/user.service'
import { ToolbarButton } from '../ToolbarButton'
import { StyledDialog } from 'components/global/StyledDialog'

export default function TourGapsModal (tourId) {
  const [showModal, setShowModal] = React.useState(false)
  const [gapsList, setGapsList] = React.useState([{
    venueId: '',
    name: '',
    ShowDate: undefined,
    BookingId: undefined
  }])
  const [venueList, setVenueList] = React.useState([])
  const [inputs, setInputs] = useState({
    BookingId: 0,
    Distance: 0,
    VenueId: 0
  })

  const [date, setDate] = useState('')
  const [distance, setDistance] = useState('')
  const [venue, setVenue] = useState('')
  const [lastVenue, setLastVenue] = useState(0)
  const [submittable, setSubmittable] = useState(false)
  /**
     * Avalable dates
     */
  useEffect(() => {
    // @ts-ignore
    fetch(`/api/bookings/NotBooked/${tourId.TourId}`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((bookings) => {
        setGapsList(bookings)
      })
  }, [tourId.TourId])

  /**
     *  Venue List
     * */
  useEffect(() => {
    if (lastVenue == 0) {
      fetch(`/api/venue/read/venueVenue/${lastVenue}/${inputs.Distance}`)
        .then((res) => res.json())
        .then((data) => {
          setVenueList(data)
        })
    } else {
      fetch(`/api/venue/read/allVenues/${userService.userValue.accountAdmin}`)
        .then((res) => res.json())
        .then((data) => {
          setVenueList(data)
        })
    }
  }, [inputs.Distance, lastVenue])

  useEffect(() => {
    if (inputs.VenueId === 0) {
      setSubmittable(false)
    } else {
      setSubmittable(true)
    }
  }, [inputs.VenueId])

  /**
     * Last Vennue
     */
  useEffect(() => {
    // @ts-ignore
    if (inputs.BookingId !== 0) {
      const data = {
        BookingId: inputs.BookingId,
        TourId: tourId.TourId
      }
      fetch('/api/bookings/LastVenue/', {
        method: 'POST',
        body: JSON.stringify(data)
      })
        .then((res) => res.json())
        .then((lastVenue) => {
          if (lastVenue !== null) {
            setLastVenue(lastVenue.venueId)
          } else {
            setLastVenue(0)
          }
        })
    }
  }, [inputs.BookingId])

  function handleOnSubmit (e) {
    e.preventDefault()

    alert('Submit Possioble')
    fetch('/api/bookings/book/gap', {
      method: 'POST',
      body: JSON.stringify(inputs)
    })
      .then((res) => res.json())
      .then((bookings) => {
        alert(JSON.stringify(bookings))
      })
  }

  function reset () {
    setVenue('')
    setVenueList([])
    setDate('')
    setDistance('')
  }

  function handleOnChange (e) {
    e.persist()
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))

    alert(JSON.stringify(inputs))
  }

  return (
    <>
      <ToolbarButton onClick={() => setShowModal(true)}>Gap Suggestions</ToolbarButton>
      <StyledDialog title="Gap Suggestions" open={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleOnSubmit}>
          <div className="flex flex-row">
            <p>
              Select a date then select a distance Segue will then search for possible
              location
            </p>
          </div>

          <div className="flex flex-row">
            <label htmlFor="date" className="">Tour Gap Date</label>
            <select
              name={'BookingId'}
              id={'BookingId'}
              onChange={handleOnChange}
            >
              <option value="">Select a Date</option>
              {gapsList.map((date) => (
                <>
                  <option value={date.BookingId}>{dateService.dateToSimple(date.ShowDate)}</option>
                </>
              ))}
            </select>

          </div>
          <div className="flex flex-row">
            <label htmlFor="venueDistance" className="">Select a Distance Miles (Estimated Time)</label>

            <select
              name={'Distance'}
              id={'Distance'}
              disabled={inputs.BookingId == 0}
              onChange={handleOnChange}
            >
              <option value={''}>Select a Distance</option>

              <>
                <option value={25}>25 </option>
                <option value={50}>50 </option>
                <option value={100}>100 </option>
                <option value={125}>125</option>
                <option value={150}>150</option>
                <option value={175}>175 </option>
                <option value={200}>200</option>
              </>
                                            ))
            </select>

          </div>
          <div className="flex flex-row">
            <label htmlFor="venueDistance" className="">Select a Venue</label>

            <select
              name={'VenueId'}
              id={'VenueId'}
              disabled={inputs.Distance === null}
              onChange={handleOnChange}
            >

              {venueList.length > 0

                ? venueList.map((venue) => (
                  <>
                    <option value=

                      {venue.Venue1Id}

                    >{venue.Name}

                                                        Miles {venue.Mileage}, Time {venue.TimeMins})

                    </option>
                  </>
                ))
                : <option value={''}>Select a Distance</option>
              }

            </select>
                                            * Select a date and distance to filter venuw
          </div>

          <StyledDialog.FooterContainer>
            <StyledDialog.FooterCancel onClick={() => setShowModal(false)} />
            <StyledDialog.FooterContinue intent='DANGER' onClick={reset}>Reset</StyledDialog.FooterContinue>
            <StyledDialog.FooterContinue submit disabled={!submittable}>Add Booking</StyledDialog.FooterContinue>
          </StyledDialog.FooterContainer>
        </form>
      </StyledDialog>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {

    }
  }
}
