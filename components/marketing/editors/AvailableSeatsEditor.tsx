import axios from 'axios'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInputText } from 'components/global/forms/FormInputText'
import React from 'react'

interface AvailableSeatEditorProps {
  availableSeat?: any
  open: boolean
  triggerClose: (refresh: boolean) => void
}

export const AvailableSeatEditor = ({ availableSeat, open, triggerClose }: AvailableSeatEditorProps) => {
  const [inputs, setInputs] = React.useState<Partial<any>>(availableSeat)
  const [status, setStatus] = React.useState({ submitting: false, submitted: true })

  const creating = !inputs.Id

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault()
    setStatus({ ...status, submitting: true })

    if (creating) {
      try {
        await axios.post('/api/marketing/availableSeats/create', inputs)
        triggerClose(true)
      } catch {
        setStatus({ ...status, submitting: false })
      }
    } else {
      try {
        await axios.post('/api/marketing/availableSeats/update', inputs)
        triggerClose(true)
      } catch {
        setStatus({ ...status, submitting: false })
      }
    }
  }

  const handleDelete = async () => {
    setStatus({ ...status, submitting: true })
    try {
      await axios.post('/api/marketing/availableSeats/delete', inputs)
      triggerClose(true)
    } catch {
      setStatus({ ...status, submitting: false })
    }
  }

  const handleOnChange = async (e) => {
    e.persist()
    const { id, value } = e.target

    setInputs((prev) => ({
      ...prev,
      [id]: value
    }))

    setStatus({
      submitted: false,
      submitting: false
    })
  }

  return (
    <StyledDialog title={creating ? 'Create Available Seat' : 'Edit Available Seat'} open={open} onClose={() => triggerClose(false)}>
      <form onSubmit={handleOnSubmit}>
        <FormInputText name="Temp" label="Temp" value={inputs.Temp} onChange={handleOnChange} />
        <StyledDialog.FooterContainer>
          <StyledDialog.FooterCancel onClick={() => triggerClose(false)} />
          <StyledDialog.FooterDelete onClick={handleDelete} disabled={creating || status.submitting}>Delete</StyledDialog.FooterDelete>
          <StyledDialog.FooterContinue disabled={status.submitted || status.submitting} submit>{ creating ? 'Create' : 'Update' }</StyledDialog.FooterContinue>
        </StyledDialog.FooterContainer>
      </form>
    </StyledDialog>
  )
}
