import classNames from 'classnames'
import { useRecoilState, useRecoilValue } from 'recoil'
import { dateService } from 'services/dateService'
import { DateViewModel } from 'state/booking/selectors/scheduleSelector'
import { viewState } from 'state/booking/viewState'
import { VenueDisplay } from './VenueDisplay'
import { RehearsalDisplay } from './RehearsalDisplay'
import { PerformanceBadge } from './table/PerformanceBadge'
import { unique } from 'radash'
import { weekNoSelector } from 'state/booking/selectors/weekNoSelector'

interface ScheduleRowProps {
  date: DateViewModel
}

export const ScheduleRow = ({ date }: ScheduleRowProps) => {
  const [view, setView] = useRecoilState(viewState)
  const weekNos = useRecoilValue(weekNoSelector)

  const dateKey = date.Date.split('T')[0]

  const selected = view.selectedDate === date.Date.split('T')[0]

  const selectDate = (e: any) => {
    e.stopPropagation()
    setView({ selectedDate: dateKey })
  }

  let rowClass = 'grid gap-1 grid-cols-12 items-center py-3 w-full border-l-4 border-transparent px-2'
  if (selected) rowClass += classNames(rowClass, 'bg-blue-200 border-blue-500')

  const rehearsalId = date.RehearsalIds.length ? date.RehearsalIds[0] : undefined

  // We get duplicates for each performance
  const uniqueBookingIds = unique(date.BookingIds)

  return (
    <div className="even:bg-gray-100 border-b border-gray-300 cursor-pointer" onClick={selectDate}>
      <div className={rowClass} >
        <div className="col-span-1 font-bold text-soft-primary-grey max-w-[25px] text-center">
          { weekNos[date.Date] }
        </div>
        <div className="col-span-4 font-medium text-soft-primary-grey">
          { dateService.dateToSimple(date.Date) }
          <br />
          { dateService.getWeekDay(date.Date).slice(0, 3)}
        </div>
        <div className="col-span-7">
          { uniqueBookingIds.map((id: number) => (
            <VenueDisplay key={id} bookingId={id} date={date.Date}>
              { date.Performances?.filter(x => x.BookingId === id).map(p => (<PerformanceBadge key={p.Id} performance={p} />))}
            </VenueDisplay>
          ))}
          <RehearsalDisplay rehearsalId={rehearsalId} />
          <ul>
            { date.GetInFitUpIds.map((id) => (<span key={id}>GetInFitUp</span>))}
          </ul>
        </div>
      </div>
    </div>
  )
}
