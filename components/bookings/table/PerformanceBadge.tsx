import { format } from 'date-fns'
import { useRecoilValue } from 'recoil'
import { performanceState } from 'state/booking/performanceState'

interface PerformanceBadgeProps {
  performanceId: number
}

export const PerformanceBadge = ({ performanceId }: PerformanceBadgeProps) => {
  const perfromanceDict = useRecoilValue(performanceState)
  const performance = perfromanceDict[performanceId]

  if (!performance) return

  return (
    <div className="px-2 rounded inline-block bg-teal-400 mr-2">
      { format(new Date(performance.Date), 'HH:mm') }
    </div>
  )
}
