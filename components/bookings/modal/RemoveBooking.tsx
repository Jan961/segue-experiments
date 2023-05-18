import React from 'react'
import { ToolbarButton } from '../ToolbarButton'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInfo } from 'components/global/forms/FormInfo'
import { useSetRecoilState } from 'recoil'
import { bookingDictSelector } from 'state/selectors/bookingDictSelector'
import axios from 'axios'

interface RemoveBookingProps {
  bookingId: number;
}

export default function RemoveBooking ({ bookingId }: RemoveBookingProps) {
  const [showModal, setShowModal] = React.useState(false)
  const updateBooking = useSetRecoilState(bookingDictSelector)

  const handleOnSubmit = async (e: any) => {
    e.preventDefault()

    const response = await axios.post('/api/bookings/delete/', { bookingId })
    const updated = response.data
    updated.ShowDate = new Date(updated.ShowDate)
    updateBooking(updated)

    setShowModal(false)
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
            <StyledDialog.FooterContinue submit intent='DANGER'>
              Delete
            </StyledDialog.FooterContinue>
          </StyledDialog.FooterContainer>
        </form>
      </StyledDialog>
    </>
  )
}
