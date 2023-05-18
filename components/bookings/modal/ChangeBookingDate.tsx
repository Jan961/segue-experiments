import React, { useEffect, useState } from 'react'
import { dateService } from 'services/dateService'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInputTextAttached } from 'components/global/forms/FormInputSetter'
import { useRecoilValue } from 'recoil'
import { bookingDictSelector } from 'state/selectors/bookingDictSelector'
import { FormInfo } from 'components/global/forms/FormInfo'
import { FormInputSelect } from 'components/global/forms/FormInputSelect'

interface ChangeBookingDateProps {
  bookingId: number
}

export default function ChangeBookingDate ({ bookingId }: ChangeBookingDateProps) {
  const bookingDict = useRecoilValue(bookingDictSelector)
  const [showModal, setShowModal] = React.useState(false)
  const [availableDates, setAvailableDates] = useState([])
  const [newBookingId, setNewBookingId] = useState(bookingId)

  const booking = bookingDict[bookingId]
  const currentTourId = booking.TourId

  // Get available Dates
  useEffect(() => {
    if (!showModal) return

    fetch(`/api/bookings/NotBooked/${currentTourId}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableDates(data)
      })
  }, [showModal])

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Swap around the dates
    e.preventDefault()

    // Todo, this should be an atomic operation in a single call
    /*
    // Update Booking with Date to Existing Date
    fetch('/api/bookings/update/date', {
      method: 'POST',
      body: JSON.stringify({
        BookingId: booking.BookingId,
        ShowDate: dateService.toISO(newBookingDate)
      })
    })

    // Update Booking to new Dare
    fetch('/api/bookings/update/date', {
      method: 'POST',
      body: JSON.stringify({
        BookingId: newBookingId,
        ShowDate: dateService.toISO(booking.ShowDate)
      })
    })
    */

    setShowModal(false)
  }

  function handleOnChange (e) {
    e.persist()
    setNewBookingId(e.target.value)
  }

  const options = availableDates.map((date) => ({ text: dateService.dateStringToSimple(date.ShowDate), value: date.BookingId }))

  return (
    <>
      <FormInputTextAttached name="ShowDate" value={dateService.dateStringToSimple(booking.ShowDate)} onClick={() => setShowModal(true)} />
      <StyledDialog title={`Move Date: ${dateService.dateToSimple(booking.ShowDate)}`} open={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleOnSubmit}>
          <FormInfo intent='DANGER' header="Warning">
            Changing a booking will move all related items to the new date.
          </FormInfo>
          <FormInputSelect label="New Date" name="NewBookingId" value={newBookingId} onChange={handleOnChange} options={options} />
          <StyledDialog.FooterContainer>
            <StyledDialog.FooterCancel onClick={() => setShowModal(false)} />
            <StyledDialog.FooterContinue disabled={bookingId === newBookingId} submit>Change Date</StyledDialog.FooterContinue>
          </StyledDialog.FooterContainer>
        </form>
      </StyledDialog>
    </>
  )
}

