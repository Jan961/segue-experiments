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
  const [status, setStatus] = React.useState({ submitting: false, changed: false })

  const datePart = inputs.Date ? inputs.Date.split('T')[0] : ''
  const timePart = inputs.Date ? inputs.Date.split('T')[1] : ''

  const handleOnChange = (e: any) => {
    const { id, value } = e.target

    setInputs((prev) => ({
      ...prev,
      [id]: value
    }))
    setStatus({ submitting: false, changed: true })
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <FormInputDate
        value={datePart}
        onChange={handleOnChange}
      />
      <FormInputTime
        value={timePart}
        onChange={handleOnChange}
      />
    </div>
  )
}
