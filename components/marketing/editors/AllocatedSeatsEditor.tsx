import axios from 'axios'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInfo } from 'components/global/forms/FormInfo'
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric'
import { FormInputText } from 'components/global/forms/FormInputText'
import React from 'react'

interface AllocatedSeatsEditorProps {
  allocatedSeat?: any
  open: boolean
  triggerClose: (refresh: boolean) => void
  max: number
}

export const AllocatedSeatsEditor = ({ allocatedSeat, open, triggerClose, max }: AllocatedSeatsEditorProps) => {
  const [inputs, setInputs] = React.useState<Partial<any>>({ ...allocatedSeat, Seats: Math.max(1, allocatedSeat.Seats) })
  const [status, setStatus] = React.useState({ submitting: false, submitted: true })

  const creating = !inputs.Id

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault()
    setStatus({ ...status, submitting: true })

    if (creating) {
      try {
        await axios.post('/api/marketing/allocatedSeats/create', inputs)
        triggerClose(true)
      } catch {
        setStatus({ ...status, submitting: false })
      }
    } else {
      try {
        await axios.post('/api/marketing/allocatedSeats/update', inputs)
        triggerClose(true)
      } catch {
        setStatus({ ...status, submitting: false })
      }
    }
  }

  const handleDelete = async () => {
    setStatus({ ...status, submitting: true })
    try {
      await axios.post('/api/marketing/allocatedSeats/delete', inputs)
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

  const changeSeats = (seats: number) => {
    setInputs({ ...inputs, Seats: seats })
    setStatus({
      submitted: false,
      submitting: false
    })
  }

  const maxSeats = max + allocatedSeat.Seats

  return (
    <StyledDialog title={creating ? 'Create Allocated Seat' : 'Edit Allocated Seat'} open={open} onClose={() => triggerClose(false)}>
      <form onSubmit={handleOnSubmit}>
        <FormInputText name="ArrangedBy" label="Arranged By" value={inputs.ArrangedBy} onChange={handleOnChange} />
        <FormInputText name="RequestedBy" label="Requested By" value={inputs.RequestedBy} onChange={handleOnChange} />
        <FormInputNumeric min={1} name="Seats" label="Seats" value={inputs.Seats} onChange={changeSeats} />
        {inputs.Seats > maxSeats && (<FormInfo intent='DANGER'>You have allocated more seats than available</FormInfo>)}
        <FormInputText name="SeatsAllocated" label="Seats Allocated" value={inputs.SeatsAllocated} onChange={handleOnChange} />
        <FormInputText required name="TicketHolderName" label="Name" value={inputs.TicketHolderName} onChange={handleOnChange} />
        <FormInputText name="TicketHolderEmail" label="Email" value={inputs.TicketHolderEmail} onChange={handleOnChange} />
        <FormInputText area name="Comments" label="Comments" value={inputs.Comments} onChange={handleOnChange} />
        <FormInputText area name="VenueConfirmationNotes" label="Venue Confirmation Notes" value={inputs.VenueConfirmationNotes} onChange={handleOnChange} />
        <StyledDialog.FooterContainer>
          <StyledDialog.FooterCancel onClick={() => triggerClose(false)} />
          <StyledDialog.FooterDelete onClick={handleDelete} disabled={creating || status.submitting}>Delete</StyledDialog.FooterDelete>
          <StyledDialog.FooterContinue disabled={status.submitted || status.submitting} submit>{ creating ? 'Create' : 'Update' }</StyledDialog.FooterContinue>
        </StyledDialog.FooterContainer>
      </form>
    </StyledDialog>
  )
}
