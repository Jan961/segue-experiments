import { format } from 'date-fns'
import { useRecoilValue } from 'recoil'
import { performanceDictSelector } from 'state/booking/selectors/performanceDictSelector'

interface PerformanceBadgeProps {
  performanceId: number
}

export const PerformanceBadge = ({ performanceId }: PerformanceBadgeProps) => {
  const perfromanceDict = useRecoilValue(performanceDictSelector)
  const performance = perfromanceDict[performanceId]

  return (
    <div className="px-2 rounded inline-block bg-teal-400 mr-2">
      { format(new Date(performance), 'HH:mm') }
    </div>
  )
}
