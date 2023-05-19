import React from 'react'
import { dateService } from 'services/dateService'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInputTextAttached } from 'components/global/forms/FormInputSetter'
import { useRecoilState } from 'recoil'
import { bookingDictSelector } from 'state/selectors/bookingDictSelector'
import { FormInfo } from 'components/global/forms/FormInfo'
import { FormInputSelect } from 'components/global/forms/FormInputSelect'
import { Spinner } from 'components/global/Spinner'
import axios from 'axios'

interface ChangeBookingDateProps {
  bookingId: number
}

export default function ChangeBookingDate ({ bookingId }: ChangeBookingDateProps) {
  const [bookingDict, updateBooking] = useRecoilState(bookingDictSelector)
  const [showModal, setShowModal] = React.useState(false)
  const [availableDates, setAvailableDates] = React.useState([])
  const [newBookingId, setNewBookingId] = React.useState(bookingId)
  const [loading, setLoading] = React.useState(true)

  const booking = bookingDict[bookingId]
  const currentTourId = booking.TourId

  // Get available Dates
  React.useEffect(() => {
    if (!showModal) return

    setLoading(true)

    fetch(`/api/bookings/NotBooked/${currentTourId}`)
      .then((res) => res.json())
      .then((data) => {
        const withoutExisting = data.filter((x: any) => x.BookingId !== bookingId)

        setAvailableDates(withoutExisting)
        if (withoutExisting.length > 0) {
          setNewBookingId(withoutExisting[0].BookingId)
        }
        setLoading(false)
      })
  }, [showModal, bookingId, currentTourId])

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Swap around the dates
    e.preventDefault()

    const response = await axios.post('/api/bookings/update/date', {
      sourceId: booking.BookingId,
      destinationId: newBookingId
    })

    for (const booking of response.data) {
      updateBooking(booking)
    }

    setShowModal(false)
  }

  function handleOnChange (e) {
    e.persist()
    setNewBookingId(e.target.value)
  }

  const options = availableDates.map((date) => ({ text: dateService.dateToSimple(date.ShowDate), value: date.BookingId }))
  const datesAvailable = options.length > 0

  return (
    <>
      <FormInputTextAttached name="ShowDate" value={dateService.dateToSimple(booking.ShowDate)} onClick={() => setShowModal(true)} />
      <StyledDialog title={`Move Date: ${dateService.dateToSimple(booking.ShowDate)}`} open={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleOnSubmit}>
          <FormInfo intent='DANGER' header="Warning">
            Changing a booking will move all related items to the new date.
          </FormInfo>
          { loading && <Spinner className="p-4" size='md'/> }
          { !loading && (
            <>
              { datesAvailable && (<FormInputSelect inline label="New Date" name="NewBookingId" value={newBookingId} onChange={handleOnChange} options={options} />) }
              { !datesAvailable && (<p>No free dates available.</p>)}
              <StyledDialog.FooterContainer>
                <StyledDialog.FooterCancel onClick={() => setShowModal(false)} />
                <StyledDialog.FooterContinue disabled={bookingId === newBookingId || !datesAvailable} submit>Change Date</StyledDialog.FooterContinue>
              </StyledDialog.FooterContainer>
            </>
          )}
        </form>
      </StyledDialog>
    </>
  )
}

