import React, { useEffect, useState } from 'react'
import { dateService } from 'services/dateService'
import { userService } from 'services/user.service'
import { ToolbarButton } from '../ToolbarButton'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInputSelect } from 'components/global/forms/FormInputSelect'

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
    setVenueList([])
  }

  function handleOnChange (e) {
    e.persist()
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  const availableDatesOptions = gapsList.map(x => ({ text: dateService.dateStringToSimple(x.ShowDate), value: x.BookingId}))
  const availableDistances = Array.from({ length: 8 }, (_, i) => ({ text: String((i + 1) * 25), value: String((i + 1) * 25) }));

  return (
    <>
      <ToolbarButton onClick={() => setShowModal(true)}>Gap Suggestions</ToolbarButton>
      <StyledDialog width="xl" title="Gap Suggestions" open={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleOnSubmit}>
          <p>
            Select a date then select a distance Segue will then search for possible
            location
          </p>

          <FormInputSelect name="BookingId" label="Selected Date" onChange={handleOnChange} value={inputs.BookingId} options={availableDatesOptions} />
          <FormInputSelect name="Distance" label="Distance" onChange={handleOnChange} value={inputs.Distance} options={availableDistances} />
          <FormInputSelect name="VenuId" label="Venue" onChange={handleOnChange} value={inputs.VenueId} options={[]} disabled />
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
                  <option value={venue.Venue1Id}>{venue.Name} key={venue.Venue1Id}>
                      Miles {venue.Mileage}, Time {venue.TimeMins})
                  </option>
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
