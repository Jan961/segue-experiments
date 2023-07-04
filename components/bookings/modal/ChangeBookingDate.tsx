import React from 'react'
import { dateToPicker, dateToSimple } from 'services/dateService'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInputTextAttached } from 'components/global/forms/FormInputSetter'
import { useRecoilState } from 'recoil'
import { FormInfo } from 'components/global/forms/FormInfo'
import axios from 'axios'
import { FormInputDate } from 'components/global/forms/FormInputDate'
import { UpdateDateParams } from 'pages/api/bookings/update/date'
import { bookingState } from 'state/booking/bookingState'
import { distanceState } from 'state/booking/distanceState'

interface ChangeBookingDateProps {
  bookingId: number
  disabled?: boolean
}

export const ChangeBookingDate = ({ bookingId, disabled }: ChangeBookingDateProps) => {
  const [bookingDict, setBookingDict] = useRecoilState(bookingState)
  const [showModal, setShowModal] = React.useState(false)
  const [date, setDate] = React.useState(undefined)
  const [loading, setLoading] = React.useState(false)
  const [distance, setDistance] = useRecoilState(distanceState)

  const booking = bookingDict[bookingId]

  React.useEffect(() => {
    setDate(dateToPicker(booking.Date))
  }, [bookingId, booking])

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault()
    setLoading(true)

    const params: UpdateDateParams = {
      bookingId,
      date
    }

    try {
      const { data } = await axios.post('/api/bookings/update/date', params)

      const newState = { ...bookingDict, [data.Id]: data }
      setBookingDict(newState)
      setDistance({ ...distance, outdated: true })
      setShowModal(false)
    } finally {
      setLoading(false)
    }
  }

  const handleOnChange = (e: any) => {
    setDate(e.target.value)
  }

  const modalDisabled = loading || (dateToPicker(booking.Date) === dateToPicker(date))

  return (
    <>
      <FormInputTextAttached disabled={disabled} name="Date" value={dateToSimple(booking.Date)} onClick={() => setShowModal(true)} />
      <StyledDialog title={`Move Date: ${dateToSimple(booking.Date)}`} open={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleOnSubmit}>
          <FormInfo intent='DANGER' header="Warning">
            Changing a booking will move all related items to the new date.
          </FormInfo>
          <FormInputDate label="New Date" value={date} onChange={handleOnChange} />
          <>
            <StyledDialog.FooterContainer>
              <StyledDialog.FooterCancel onClick={() => setShowModal(false)} />
              <StyledDialog.FooterContinue disabled={modalDisabled} submit>Change Date</StyledDialog.FooterContinue>
            </StyledDialog.FooterContainer>
          </>
        </form>
      </StyledDialog>
    </>
  )
}
