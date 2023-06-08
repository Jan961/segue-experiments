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
  const [{ submitting, changed }, setStatus] = React.useState({ submitting: false, changed: false })
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

  const saveDetails = async () => {
    const { data } = await axios({
      method: 'POST',
      url: '/api/bookings/Performances/upsert/',
      data: inputs
    })

    const newPerf = { ...perfDict, [data.Id]: data }
    setPerfDict(newPerf)
  }

  const save = async (e) => {
    e.preventDefault()
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
      <div className="grid grid-cols-2 gap-2">
        <FormInputDate
          name="datePart"
          value={datePart}
          onChange={handleOnChange}
        />
        <FormInputTime
          name="timePart"
          value={timePart}
          onChange={handleOnChange}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <FormInputButton
            className="w-full"
            text="Delete"
            intent="DANGER"
            onClick={initiateDelete}
            disabled={submitting}
          />
        </div>
        <div className="col-span-2">
          <FormInputButton
            className="w-full"
            text="Save"
            intent='PRIMARY'
            disabled={submitting || !changed}
            onClick={save}
          />
        </div>
      </div>
    </>
  )
}
