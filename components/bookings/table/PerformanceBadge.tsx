import { format } from 'date-fns'
import { PerformanceViewModel } from 'state/booking/selectors/scheduleSelector'

interface PerformanceBadgeProps {
  performance: PerformanceViewModel
}

export const PerformanceBadge = ({ performance }: PerformanceBadgeProps) => {
  return (
    <div className="px-2 rounded inline-block bg-teal-400 mr-2">
      { format(new Date(performance.Date), 'HH:mm') }
    </div>
  )
}
