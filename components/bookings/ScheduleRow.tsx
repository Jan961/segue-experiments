import classNames from 'classnames'
import { useRecoilState, useRecoilValue } from 'recoil'
import { dateService } from 'services/dateService'
import { DateViewModel } from 'state/booking/selectors/scheduleSelector'
import { viewState } from 'state/booking/viewState'
import { VenueDisplay } from './VenueDisplay'
import { RehearsalDisplay } from './RehearsalDisplay'
import { PerformanceBadge } from './table/PerformanceBadge'
import { unique } from 'radash'
import { DateDisplay } from './DateDisplay'
import { bookingDictSelector } from 'state/booking/selectors/bookingDictSelector'

interface ScheduleRowProps {
  date: DateViewModel
}

export const ScheduleRow = ({ date }: ScheduleRowProps) => {
  const [view, setView] = useRecoilState(viewState)
  const bookingDict = useRecoilValue(bookingDictSelector)

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

  for (const id of uniqueBookingIds) {
    if (bookingDict[id].StatusCode === 'U') rowClass = classNames(rowClass, 'italic')
  }

  return (
    <div className="even:bg-black even:bg-opacity-5 bg-blend-multiply border-b border-gray-300 cursor-pointer" onClick={selectDate}>
      <div className={rowClass} >
        <DateDisplay date={date.Date} />
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
