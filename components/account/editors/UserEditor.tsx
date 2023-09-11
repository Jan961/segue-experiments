import axios from 'axios'
import { StyledDialog } from 'components/global/StyledDialog'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { FormInputText } from 'components/global/forms/FormInputText'
import { UserDto } from 'interfaces'
import React from 'react'

interface UserEditorProps {
  user?: UserDto
  triggerClose: () => void
}

export const UserEditor = ({ user, triggerClose }: UserEditorProps) => {
  const [inputs, setInputs] = React.useState(user || { Name: '', Email: '' })
  const [status, setStatus] = React.useState({ submitted: true, submitting: false })

  const editMode = !inputs.Id

  // Modified to handle arrays
  const handleOnChange = (e) => {
    const { id, value } = e.target
    setInputs((prev) => {
      const newInputs = { ...prev }
      newInputs[id] = value
      return newInputs
    })

    setStatus({
      submitted: false,
      submitting: false
    })
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setStatus({ submitted: false, submitting: true })

    if (editMode) {
      axios({
        method: 'POST',
        url: '/api/user/update/',
        data: inputs
      }).then((response) => {
        // TODO: Update Context
        setStatus({ submitted: true, submitting: false })
        triggerClose()
      }).catch((error) => {
        alert(error)
        setStatus({ submitted: false, submitting: false })
      })
    } else {
      axios({
        method: 'POST',
        url: '/api/user/create/',
        data: inputs
      }).then((response) => {
        // TODO: Update Context
        setStatus({ submitted: true, submitting: false })
        triggerClose()
      }).catch((error) => {
        alert(error)
        setStatus({ submitted: false, submitting: false })
      })
    }
  }

  const handleDelete = async () => {
    setStatus({ ...status, submitting: true })
    try {
      await axios.post('/api/marketing/contactNotes/delete', inputs)
      triggerClose()
    } catch {
      setStatus({ ...status, submitting: false })
    }
  }

  return (
    <form onSubmit={handleOnSubmit}>
      <FormInputText name="Name" label="Name" onChange={handleOnChange} value={inputs.Name} />
      <FormInputText name="Email" label="Email" onChange={handleOnChange} value={inputs.Email} />

      <StyledDialog.FooterContainer>
        { editMode && (<StyledDialog.FooterCancel onClick={triggerClose} />)}
        { !editMode && (<StyledDialog.FooterDelete onClick={handleDelete} disabled={status.submitting}>Delete</StyledDialog.FooterDelete>)}
        <FormInputButton submit text={ !editMode ? 'Save User' : 'Create User'} disabled={status.submitted} loading={status.submitting} />
      </StyledDialog.FooterContainer>
    </form>
  )
}
