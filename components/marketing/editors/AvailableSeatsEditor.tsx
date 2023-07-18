import axios from 'axios'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric'
import React from 'react'

interface AvailableSeatsEditorProps {
  seatsAvailable: number
  seatsAllocated: number
  perfId: number
  open: boolean
  triggerClose: (refresh: boolean) => void
}

export const AvailableSeatsEditor = ({ seatsAvailable, seatsAllocated, open, triggerClose, perfId }: AvailableSeatsEditorProps) => {
  const [seats, setSeats] = React.useState<number>(seatsAvailable)
  const [status, setStatus] = React.useState({ submitting: false, submitted: true })

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault()
    setStatus({ ...status, submitting: true })

    try {
      await axios.post('/api/marketing/availableSeats/update', { Seats: seats, PerformanceId: perfId })
      triggerClose(true)
    } catch {
      setStatus({ ...status, submitting: false })
    }
  }

  const handleOnChange = async (value: number) => {
    setSeats(value)

    setStatus({
      submitted: false,
      submitting: false
    })
  }

  return (
    <StyledDialog title={'Set Available Seats'} open={open} onClose={() => triggerClose(false)}>
      <form onSubmit={handleOnSubmit}>
        <FormInputNumeric min={seatsAllocated} name="Seats" label="Seats Available" value={seats} onChange={handleOnChange} />
        <StyledDialog.FooterContainer>
          <StyledDialog.FooterCancel onClick={() => triggerClose(false)} />
          <StyledDialog.FooterContinue disabled={status.submitted || status.submitting} submit>Update</StyledDialog.FooterContinue>
        </StyledDialog.FooterContainer>
      </form>
    </StyledDialog>
  )
}
