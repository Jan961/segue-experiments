import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { dateService } from 'services/dateService'
import { StyledDialog } from 'components/global/StyledDialog'
import { ToolbarButton } from '../ToolbarButton'

export default function ChangeBookingDate ({ BookingId, currentTourId }) {
  const [showModal, setShowModal] = React.useState(false)
  const [originalDate, setOriginalDate] = useState(null)
  const [data, setData] = useState([])
  const [availableDates, setAvailableDates] = useState([])
  const [newBookingDate, setNewBookingDate] = useState(null)
  const [newBookingId, setNewBookingId] = useState(null)

  // Get available Dates
  const [inputs, setInputs] = useState({
    ShowDate: '',
    BookingId
  })

  useEffect(() => {
    if (showModal) {
      fetch(`/api/bookings/booking/${BookingId}`)
        .then((res) => res.json())
        .then((data) => {
          setData(data)
          setInputs({
            ShowDate: data.ShowDate,
            BookingId
          })
          setOriginalDate(data.ShowDate.substring(0, 10))
        })
    }
  }, [BookingId, showModal])

  useEffect(() => {
    fetch(`/api/bookings/NotBooked/${currentTourId}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableDates(data)
      })
  }, [currentTourId])

  function handleOnSubmit (e) {
    e.preventDefault()

    alert(dateService.toSql(newBookingDate))
    // Update Booking with Date to Existing Date
    fetch('/api/bookings/update/date', {
      method: 'POST',
      body: JSON.stringify({
        BookingId: inputs.BookingId,
        ShowDate: dateService.toISO(newBookingDate)
      })
    })

    // Update Booking to new Dare
    fetch('/api/bookings/update/date', {
      method: 'POST',
      body: JSON.stringify({
        BookingId: newBookingId,
        ShowDate: dateService.toISO(new Date(originalDate))
      })
    })

    // forceReload();
    setShowModal(false)
  }

  function handleOnChange (e) {
    e.persist()

    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))

    const OtherBooking = JSON.parse(e.target.value)
    setNewBookingDate(OtherBooking.date)
    setNewBookingId(OtherBooking.BookingId)
  }

  return (
    <>
      <ToolbarButton onClick={() => setShowModal(true)}>Change Date</ToolbarButton>
      <StyledDialog title="Change Booking Date" open={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleOnSubmit}>
          <div className="flex flex-row">
            <div className={'flex flex-col m-2'}>
              <p>
                                            Warning! You are about to change the date of a booking!
              </p>
              <p>This will move the booking and all related items to the new date, inclusion contract and performances </p>
            </div>
          </div>
          <div className="flex flex-row">
            <div className={'flex flex-col m-2'}>
                                            Original Date: {dateService.dateToSimple(originalDate)}
            </div>
          </div>
          <div className="flex flex-row">
            <div className={'flex flex-col m-2'}>

              <select
                id={'ShowDate'}
                name={'ShowDate'}
                onChange={handleOnChange}
                value={inputs.ShowDate}>
                { availableDates.length !== 0
                  ? availableDates.map((date, index) => (
                    <option id={date.BookingId} value={`\{"date":"${date.ShowDate}", "BookingId": "${date.BookingId}"\}`}>{dateService.dateToSimple(date.ShowDate)}</option>
                  ))
                  : null }
              </select>
            </div>
          </div>
          <StyledDialog.FooterContainer>
            <StyledDialog.FooterCancel onClick={() => setShowModal(false)} />
            <StyledDialog.FooterContinue submit>Change Date</StyledDialog.FooterContinue>
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
