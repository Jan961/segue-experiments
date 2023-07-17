import axios from 'axios'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric'
import { FormInputText } from 'components/global/forms/FormInputText'
import React from 'react'

interface VenueHoldsEditorProps {
  venueHold?: any
  open: boolean
  bookingId: number
  triggerClose: (refresh: boolean) => void
}

export const VenueHoldsEditor = ({ venueHold, open, triggerClose, bookingId }: VenueHoldsEditorProps) => {
  const [inputs, setInputs] = React.useState<Partial<any>>(venueHold)
  const [status, setStatus] = React.useState({ submitting: false, submitted: true })

  const creating = !inputs.Id

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault()
    setStatus({ ...status, submitting: true })

    if (creating) {
      try {
        console.log(inputs)
        await axios.post('/api/marketing/venueHold/create', inputs)
        triggerClose(true)
      } catch {
        setStatus({ ...status, submitting: false })
      }
    } else {
      try {
        await axios.post('/api/marketing/venueHold/update', inputs)
        triggerClose(true)
      } catch {
        setStatus({ ...status, submitting: false })
      }
    }
  }

  const handleDelete = async () => {
    setStatus({ ...status, submitting: true })
    try {
      await axios.post('/api/marketing/venueHold/delete', inputs)
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
    <StyledDialog title={creating ? 'Create Venue Hold' : 'Edit Venue Hold'} open={open} onClose={() => triggerClose(false)}>
      <form onSubmit={handleOnSubmit}>
        <FormInputText name="Role" label="Role" value={inputs.Role} onChange={handleOnChange} />
        <FormInputNumeric name="Qty" label="Quantity" value={inputs.Qty} onChange={handleOnChange} />
        <StyledDialog.FooterContainer>
          <StyledDialog.FooterCancel onClick={() => triggerClose(false)} />
          <StyledDialog.FooterDelete onClick={handleDelete} disabled={creating || status.submitting}>Delete</StyledDialog.FooterDelete>
          <StyledDialog.FooterContinue disabled={status.submitted || status.submitting} submit>{ creating ? 'Create' : 'Update' }</StyledDialog.FooterContinue>
        </StyledDialog.FooterContainer>
      </form>
    </StyledDialog>
  )
}
