import React from 'react'
import { ToolbarButton } from '../ToolbarButton'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInfo } from 'components/global/forms/FormInfo'
import { useRecoilState } from 'recoil'
import axios from 'axios'
import { bookingState } from 'state/bookingState'

interface RemoveBookingProps {
  bookingId: number;
}

export default function RemoveBooking ({ bookingId }: RemoveBookingProps) {
  const [showModal, setShowModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [bookings, setBookings] = useRecoilState(bookingState)

  const handleOnSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/bookings/delete/', { bookingId })
      const newBookings = bookings.filter(x => x.Id !== bookingId)
      setBookings(newBookings)
      setShowModal(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <ToolbarButton onClick={() => setShowModal(true)}>Remove Booking</ToolbarButton>
      <StyledDialog title={`Delete Booking: ${bookingId}`}open={showModal} onClose={() => setShowModal(false)} >
        <form onSubmit={handleOnSubmit}>
          <FormInfo header="Warning" intent='DANGER'>
            This will remove the booking from the system. All related data will also be discarded
          </FormInfo>
          <StyledDialog.FooterContainer>
            <StyledDialog.FooterCancel onClick={() => setShowModal(false)}>
              Cancel
            </StyledDialog.FooterCancel>
            <StyledDialog.FooterContinue submit intent='DANGER' disabled={loading} >
              Delete
            </StyledDialog.FooterContinue>
          </StyledDialog.FooterContainer>
        </form>
      </StyledDialog>
    </>
  )
}
