import axios from 'axios'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { FormInputDate } from 'components/global/forms/FormInputDate'
import { FormInputTime } from 'components/global/forms/FormInputTime'
import { PerformanceDTO } from 'interfaces'
import React from 'react'
import { useRecoilValue } from 'recoil'
import { performanceDictSelector } from 'state/booking/selectors/performanceDictSelector'

export interface PerformancePanelProps {
  performanceId: number
}

export const PerformancePanel = ({ performanceId }: PerformancePanelProps) => {
  const performanceDict = useRecoilValue(performanceDictSelector)
  const perf: PerformanceDTO = performanceDict[performanceId]
  const [inputs, setInputs] = React.useState<PerformanceDTO>(perf)
  const [{ submitting, changed }, setStatus] = React.useState({ submitting: false, changed: false })

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
    const response = await axios({
      method: 'POST',
      url: '/api/bookings/update/',
      data: inputs
    })

    // const updated = response.data
    // updatePerformance(updated)
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

  const initiateDelete = () => {
    alert('Not implimented')
  }

  return (
    <>
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
      <div className="grid grid-cols-2 gap-2 pb-0">
        <FormInputButton
          className="w-full"
          text="Delete"
          intent="DANGER"
          onClick={initiateDelete}
          disabled={submitting}
        />
        <FormInputButton
          className="w-full"
          text={'Save'}
          intent='PRIMARY'
          onClick={save}
          disabled={submitting}
        />
      </div>
    </>
  )
}
