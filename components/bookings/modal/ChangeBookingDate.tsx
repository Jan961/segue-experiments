import React from 'react'
import { dateService } from 'services/dateService'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInputTextAttached } from 'components/global/forms/FormInputSetter'
import { useRecoilState } from 'recoil'
import { bookingDictSelector } from 'state/booking/selectors/bookingDictSelector'
import { FormInfo } from 'components/global/forms/FormInfo'
import axios from 'axios'
import { FormInputDate } from 'components/global/forms/FormInputDate'
import { UpdateDateParams } from 'pages/api/bookings/update/date'

interface ChangeBookingDateProps {
  bookingId: number
}

export const ChangeBookingDate = ({ bookingId }: ChangeBookingDateProps) => {
  const [bookingDict, updateBooking] = useRecoilState(bookingDictSelector)
  const [showModal, setShowModal] = React.useState(false)
  const [date, setDate] = React.useState(undefined)
  const [loading, setLoading] = React.useState(false)

  const booking = bookingDict[bookingId]

  React.useEffect(() => {
    setDate(dateService.dateToPicker(booking.Date))
  }, [bookingId, booking])

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault()
    setLoading(true)

    const data: UpdateDateParams = {
      bookingId,
      date
    }

    try {
      const response = await axios.post('/api/bookings/update/date', data)
      updateBooking(response.data)
      setShowModal(false)
    } finally {
      setLoading(false)
    }
  }

  const handleOnChange = (e: any) => {
    setDate(e.target.value)
  }

  const disabled = loading || (dateService.dateToPicker(booking.FirstDate) === dateService.dateToPicker(date))

  return (
    <>
      <FormInputTextAttached name="ShowDate" value={dateService.dateToSimple(booking.Date)} onClick={() => setShowModal(true)} />
      <StyledDialog title={`Move Date: ${dateService.dateToSimple(booking.FirstDate)}`} open={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleOnSubmit}>
          <FormInfo intent='DANGER' header="Warning">
            Changing a booking will move all related items to the new date.
          </FormInfo>
          <FormInputDate label="New Date" value={date} onChange={handleOnChange} />
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
