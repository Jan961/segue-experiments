import { PerformanceDTO } from 'interfaces'
import { useRecoilValue } from 'recoil'
import { performanceDictSelector } from 'state/booking/selectors/performanceDictSelector'

export interface PerformancePanelProps {
  performanceId: number
}

export const PerformancePanel = ({ performanceId }: PerformancePanelProps) => {
  const performanceDict = useRecoilValue(performanceDictSelector)

  const perf: PerformanceDTO = performanceDict[performanceId]

  return (
    <h2>{ perf.Date }</h2>
  )
}
