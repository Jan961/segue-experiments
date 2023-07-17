import axios from 'axios'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInputDate } from 'components/global/forms/FormInputDate'
import { FormInputText } from 'components/global/forms/FormInputText'
import { BookingContactNoteDTO } from 'interfaces'
import React from 'react'

interface VenueContactsEditorProps {
  bookingContactNote?: BookingContactNoteDTO
  open: boolean
  bookingId: number
  triggerClose: (refresh: boolean) => void
}

export const ContactNotesEditor = ({ bookingContactNote, open, triggerClose, bookingId }: VenueContactsEditorProps) => {
  const [inputs, setInputs] = React.useState<Partial<BookingContactNoteDTO>>(bookingContactNote || { BookingId: bookingId })
  const [status, setStatus] = React.useState({ submitting: false, submitted: true })

  const creating = !inputs.Id

  const handleOnSubmit = async (e: any) => {
    // Swap around the dates
    e.preventDefault()
    setStatus({ ...status, submitting: true })

    if (creating) {
      try {
        await axios.post('/api/marketing/contactNotes/create', inputs)
        triggerClose(true)
      } catch {
        setStatus({ ...status, submitting: false })
      }
    } else {
      try {
        await axios.post('/api/marketing/contactNotes/update', inputs)
        triggerClose(true)
      } catch {
        setStatus({ ...status, submitting: false })
      }
    }
  }

  const handleDelete = async () => {
    setStatus({ ...status, submitting: true })
    try {
      await axios.post('/api/marketing/contactNotes/delete', inputs)
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
    <StyledDialog title={creating ? 'Create Contact Note' : 'Edit Contact Note'} open={open} onClose={() => triggerClose(false)}>
      <form onSubmit={handleOnSubmit}>
        <FormInputText name="CoContactName" label="Contact Name" value={inputs.CoContactName} onChange={handleOnChange} />
        <FormInputDate name="ContactDate" label="Contact Date" value={inputs.ContactDate} onChange={handleOnChange} />
        <FormInputDate name="ActionByDate" label="Action By Date" value={inputs.ActionByDate} onChange={handleOnChange} />
        <FormInputText area name="Notes" label="Notes" value={inputs.Notes} onChange={handleOnChange} />
        <StyledDialog.FooterContainer>
          <StyledDialog.FooterCancel onClick={() => triggerClose(false)} />
          <StyledDialog.FooterDelete onClick={handleDelete} disabled={creating || status.submitting}>Delete</StyledDialog.FooterDelete>
          <StyledDialog.FooterContinue disabled={status.submitted || status.submitting} submit>{ creating ? 'Create' : 'Update' }</StyledDialog.FooterContinue>
        </StyledDialog.FooterContainer>
      </form>
    </StyledDialog>
  )
}
