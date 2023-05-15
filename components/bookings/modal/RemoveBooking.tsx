import React from 'react'
import { GetServerSideProps } from 'next'
import { forceReload } from 'utils/forceReload'
import { ToolbarButton } from '../ToolbarButton'
import { StyledDialog } from 'components/global/StyledDialog'

export default function RemoveBooking (bookingId) {
  const [showModal, setShowModal] = React.useState(false)

  function handleOnSubmit (e) {
    e.preventDefault()

    alert('deletre')
    console.log('DELETE --------------------------')
    fetch('/api/bookings/delete/', {
      method: 'POST',
      body: bookingId.BookingId
    })
    forceReload()
    setShowModal(false)
  }

  return (
    <>
      <ToolbarButton onClick={() => setShowModal(true)}>Remove Booking</ToolbarButton>
      <StyledDialog title={`Delete Booking: ${bookingId?.BookingId}`}open={showModal} onClose={() => setShowModal(false)} >
        <form onSubmit={handleOnSubmit}>
          <div className="flex flex-row">
            <div className={'flex flex-col m-2'}>
              <p>
                Warning! You are about to delete a booking!
              </p>
              <p>
                This will remove it from the system All related data will also be discarded
              </p>
            </div>
          </div>

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {

    }
  }
}
