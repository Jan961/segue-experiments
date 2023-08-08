import classNames from 'classnames'
import { useRecoilState, useRecoilValue } from 'recoil'
import { DateViewModel } from 'state/booking/selectors/scheduleSelector'
import { viewState } from 'state/booking/viewState'
import { BookingDisplay } from './BookingDisplay'
import { RehearsalDisplay } from './RehearsalDisplay'
import { unique } from 'radash'
import { DateDisplay } from './DateDisplay'
import { bookingState } from 'state/booking/bookingState'
import { GifuDisplay } from './GifuDisplay'
import { OtherDisplay } from './OtherDisplay'

interface ScheduleRowProps {
  date: DateViewModel
}

export const ScheduleRow = ({ date }: ScheduleRowProps) => {
  const [view, setView] = useRecoilState(viewState)
  const bookingDict = useRecoilValue(bookingState)

  const dateKey = date.Date.split('T')[0]

  const selected = view.selectedDate === date.Date.split('T')[0]

  const selectDate = (e: any) => {
    e.stopPropagation()
    setView({ selectedDate: dateKey })
  }

  let rowClass = 'flex items-center p-1 px-0 w-full border-l-4 border-transparent gap-2'
  if (selected) rowClass = classNames(rowClass, 'bg-blue-200 border-blue-500')

  // We get duplicates for each performance
  const uniqueBookingIds = unique(date.BookingIds)

  // If any are unconfirmed, display whole row in italics
  for (const id of uniqueBookingIds) {
    if (bookingDict[id]?.StatusCode === 'U') rowClass = classNames(rowClass, 'italic')
  }

  return (
    <div className="even:bg-black even:bg-opacity-5
      bg-blend-multiply border-b border-gray-300
      cursor-pointer scroll-mt-20"
    id={`booking-${date.Date.replace('/', '-')}`}
    onClick={selectDate}>
      <div className={rowClass} >
        <DateDisplay date={date.Date} />
        <div className="grid grid-rows-auto gap-y-2 flex-grow pr-1">
          { uniqueBookingIds.map((id: number) => (
            <BookingDisplay key={id} bookingId={id} date={date.Date} performanceCount={date.PerformanceIds.length} />
          ))}
          { date.RehearsalIds.map((id) => (<RehearsalDisplay key={id} rehearsalId={id} />))}
          { date.GetInFitUpIds.map((id) => (<GifuDisplay key={id} gifuId={id} />))}
          { date.OtherIds.map((id) => (<OtherDisplay key={id} otherId={id} />))}
        </div>
      </div>
    </div>
  )
}
