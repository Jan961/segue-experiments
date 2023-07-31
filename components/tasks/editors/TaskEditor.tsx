import React from 'react'
import { loggingService } from '../../../services/loggingService'
import { TourTaskDTO } from 'interfaces'
import { FormInputSelect, SelectOption } from 'components/global/forms/FormInputSelect'
import { FormInputText } from 'components/global/forms/FormInputText'
import { FormInputDate } from 'components/global/forms/FormInputDate'
import { StyledDialog } from 'components/global/StyledDialog'
import axios from 'axios'
import { tourState } from 'state/tasks/tourState'
import { useRecoilValue } from 'recoil'
import { FormInputNumeric } from 'components/global/forms/FormInputNumeric'

interface NewTaskFormProps {
  task?: TourTaskDTO
  triggerClose: () => void
  open: boolean
  recurring?: boolean
}

const DEFAULT_TASK: TourTaskDTO = {
  Id: undefined,
  TourId: 0,
  Code: 0,
  Name: '',
  Interval: 'once',
  CompleteByPostTour: false,
  StartByPostTour: false,
  Progress: 0,
  Priority: 0
}

const TaskEditor = ({ task, triggerClose, open, recurring = false }:NewTaskFormProps) => {
  const [alert, setAlert] = React.useState<string>('')
  const [inputs, setInputs] = React.useState<TourTaskDTO>(task || DEFAULT_TASK)
  const [status, setStatus] = React.useState({ submitted: true, submitting: false })
  const tours = useRecoilValue(tourState)

  const creating = !inputs.Id

  const handleOnChange = (e: any) => {
    let { id, value } = e.target

    if (id === 'TourId') value = Number(value)

    const newInputs = { ...inputs, [id]: value }
    setInputs(newInputs)
    setStatus({ ...status, submitted: false })
  }

  const handleCodeChange = (code: number) => {
    setInputs({ ...inputs, Code: code })
  }

  const handleOnSubmit = async (event) => {
    event.preventDefault()
    if (inputs.TourId !== 0) {
      try {
        const endpoint = recurring ? '/api/tasks/create/recurring' : '/api/tasks/create/single/'
        await axios.post(endpoint, inputs)
        triggerClose()
      } catch (error) {
        loggingService.logError(error)
        console.error(error)
      }
    } else {
      setAlert('Select a Tour to add a task')
    }
  }

  const tourOptions: SelectOption[] = [{ text: '-- Select Tour --', value: '' },
    ...tours.map(x => ({ text: `${x.ShowName}/${x.Code}`, value: x.Id }))]
  const progressOptions: SelectOption[] = [
    { text: 'Not Started', value: 0 },
    { text: '10%', value: 10 },
    { text: '25%', value: 25 },
    { text: '50%', value: 50 },
    { text: '75%', value: 75 },
    { text: '90%', value: 90 },
    { text: 'Completed', value: 100 }
  ]
  const statusOptions: SelectOption[] = [
    { text: 'To Do', value: 'todo' },
    { text: 'Doing', value: 'doing' },
    { text: 'Done', value: 'done' },
    { text: 'Blocked', value: 'blocked' }
  ]
  const priorityOptions: SelectOption[] = [
    { text: 'Low', value: 0 },
    { text: 'Medium', value: 1 },
    { text: 'High', value: 2 }
  ]

  return (
    <StyledDialog title={creating ? 'Create Task' : 'Edit Task'} open={open} onClose={triggerClose}>
      <form onSubmit={handleOnSubmit}>
        <p className="text-center text-red-500">{alert ?? ''}</p>
        <FormInputSelect name="TourId" label="Tour" value={inputs.TourId} onChange={handleOnChange} options={tourOptions} />
        <FormInputNumeric name="Code" label="Code" value={inputs.Code} onChange={handleCodeChange} />
        <FormInputText name="Name" label="Description" onChange={handleOnChange} value={inputs.Name} />
        <FormInputText name="AssigneeTo" label="Assigned To" onChange={handleOnChange} value={inputs.AssignedTo} />
        <FormInputText name="AssignedBy" label="Assigned By" onChange={handleOnChange} value={inputs.AssignedBy} />
        <FormInputDate name="DueDate" label="Due" onChange={handleOnChange} value={inputs.DueDate} />
        <FormInputSelect name="Progress" label="Progress" onChange={handleOnChange} value={inputs.Progress} options={progressOptions} />
        <FormInputSelect name="Status" label="Status" onChange={handleOnChange} value={inputs.Status} options={statusOptions} />
        <FormInputSelect name="Priority" label="Priority" onChange={handleOnChange} value={inputs.Priority} options={priorityOptions} />
        <FormInputDate name="FollowUp" label="Follow Up" onChange={handleOnChange} value={inputs.FollowUp} />
        <FormInputText area name="Notes" label="Notes" onChange={handleOnChange} value={inputs.Notes} />
        <StyledDialog.FooterContainer>
          <StyledDialog.FooterCancel onClick={triggerClose} />
          {/* <StyledDialog.FooterDelete onClick={handleDelete} disabled={creating || status.submitting}>Delete</StyledDialog.FooterDelete> */}
          <StyledDialog.FooterContinue disabled={status.submitted || status.submitting} submit>{ creating ? 'Create' : 'Update' }</StyledDialog.FooterContinue>
        </StyledDialog.FooterContainer>
      </form>
    </StyledDialog>
  )
}

export default TaskEditor
