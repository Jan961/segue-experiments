import React from 'react'
import { dateService } from 'services/dateService'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInputTextAttached } from 'components/global/forms/FormInputSetter'
import { useRecoilState } from 'recoil'
import { bookingDictSelector } from 'state/booking/selectors/bookingDictSelector'
import { FormInfo } from 'components/global/forms/FormInfo'
import axios from 'axios'
import { FormInputDate } from 'components/global/forms/FormInputDate'

interface ChangeBookingDateProps {
  bookingId: number
}

export default function ChangeBookingDate ({ bookingId }: ChangeBookingDateProps) {
  const [bookingDict, updateBooking] = useRecoilState(bookingDictSelector)
  const [showModal, setShowModal] = React.useState(false)
  const [showDate, setShowDate] = React.useState(undefined)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const booking = bookingDict[bookingId]
    setShowDate(dateService.dateToPicker(booking.FirstDate))
  }, [bookingId, bookingDict])

  const booking = bookingDict[bookingId]

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('/api/bookings/update/date', {
        bookingId,
        showDate
      })
      updateBooking(response.data)
      setShowModal(false)
    } finally {
      setLoading(false)
    }
  }

  const handleOnChange = (e: any) => {
    setShowDate(e.target.value)
  }

  const disabled = loading || (dateService.dateToPicker(booking.FirstDate) === dateService.dateToPicker(showDate))

  return (
    <>
      <FormInputTextAttached name="ShowDate" value={dateService.dateToSimple(booking.FirstDate)} onClick={() => setShowModal(true)} />
      <StyledDialog title={`Move Date: ${dateService.dateToSimple(booking.FirstDate)}`} open={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleOnSubmit}>
          <FormInfo intent='DANGER' header="Warning">
            Changing a booking will move all related items to the new date.
          </FormInfo>
          <FormInputDate label="New Date" value={showDate} onChange={handleOnChange} />
          <>
            <StyledDialog.FooterContainer>
              <StyledDialog.FooterCancel onClick={() => setShowModal(false)} />
              <StyledDialog.FooterContinue disabled={disabled} submit>Change Date</StyledDialog.FooterContinue>
            </StyledDialog.FooterContainer>
          </>
        </form>
      </StyledDialog>
    </>
  )
}
