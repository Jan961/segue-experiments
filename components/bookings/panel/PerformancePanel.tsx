import { faClose } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { DeleteConfirmation } from 'components/global/DeleteConfirmation'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { FormInputDate } from 'components/global/forms/FormInputDate'
import { FormInputTime } from 'components/global/forms/FormInputTime'
import { PerformanceDTO } from 'interfaces'
import { omit } from 'radash'
import React from 'react'
import { useRecoilState } from 'recoil'
import { performanceState } from 'state/booking/performanceState'

export interface PerformancePanelProps {
  performanceId: number
}

export const PerformancePanel = ({ performanceId }: PerformancePanelProps) => {
  const [perfDict, setPerfDict] = useRecoilState(performanceState)
  const perf: PerformanceDTO = perfDict[performanceId]
  const [inputs, setInputs] = React.useState<PerformanceDTO>(perf)
  const [{ submitting }, setStatus] = React.useState({ submitting: false, changed: false })
  const [deleting, setDeleting] = React.useState(false)

  const datePart = inputs.Date ? inputs.Date.split('T')[0] : ''
  const timePart = inputs.Date ? inputs.Date.split('T')[1] : ''

  const handleOnChange = (e: any) => {
    const { id, value } = e.target

    if (id === 'datePart') {
      const newDatePart = value.split('T')[0] ? value.split('T')[0] : ''
      setInputs((prev) => ({
        ...prev,
        Date: newDatePart + 'T' + timePart
      }))
    } else if (id === 'timePart') {
      setInputs((prev) => ({
        ...prev,
        Date: datePart + 'T' + value
      }))
    }
    setStatus({ submitting: false, changed: true })
  }

  const handleOnBlur = (e: any) => {
    e.preventDefault()
    save()
  }

  const saveDetails = async () => {
    const { data } = await axios({
      method: 'POST',
      url: '/api/performances/update',
      data: inputs
    })

    const newPerf = { ...perfDict, [data.Id]: data }
    setPerfDict(newPerf)
  }

  const save = async () => {
    setStatus({ submitting: true, changed: true })
    try {
      await saveDetails()
      setStatus({ submitting: false, changed: false })
    } catch {
      alert('An error occured while submitting')
      setStatus({ submitting: false, changed: true })
    }
  }

  const initiateDelete = async () => {
    setDeleting(true)
  }

  const performDelete = async () => {
    setDeleting(false)
    await axios.post('/api/performances/delete', { ...perf })
    const newState = omit(perfDict, [performanceId])
    setPerfDict(newState)
  }

  return (
    <>
      { deleting && (
        <DeleteConfirmation
          title="Delete Performance"
          onCancel={() => setDeleting(false)}
          onConfirm={performDelete}>
          <p>This will delete the performance permanently</p>
        </DeleteConfirmation>
      )}
      <div className="flex gap-2 justify-between mb-2">
        <div className='flex'>
          <FormInputDate
            inputClass='rounded-r-none h-10 mb-0'
            name="datePart"
            disabled
            value={datePart}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
          />
          <FormInputTime
            inputClass="rounded-l-none border-l-0 h-10 mb-0"
            name="timePart"
            value={timePart}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
          />
        </div>
        <div>
          <FormInputButton
            className="w-full h-10"
            icon={faClose}
            intent="DANGER"
            onClick={initiateDelete}
            disabled={submitting}
          />
        </div>
      </div>
    </>
  )
}
