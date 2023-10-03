import classNames from 'classnames'
import { useRecoilValue } from 'recoil'
import { DateViewModel } from 'state/booking/selectors/scheduleSelector'
import { BookingDisplay } from './events/BookingDisplay'
import { RehearsalDisplay } from './events/RehearsalDisplay'
import { unique } from 'radash'
import { DateDisplay } from './events/DateDisplay'
import { bookingState } from 'state/booking/bookingState'
import { GifuDisplay } from './events/GifuDisplay'
import { OtherDisplay } from './OtherDisplay'
import { CreateModal } from './modal/CreateModal'
import { TourDisplay } from './TourDisplay'

interface ScheduleRowProps {
  date: DateViewModel
}

export const ScheduleRow = ({ date }: ScheduleRowProps) => {
  const bookingDict = useRecoilValue(bookingState)

  let rowClass = 'grid grid-cols-12 items-center p-1 px-0 w-full border-l-4 border-transparent gap-2'

  // We get duplicates for each performance
  const uniqueBookingIds = unique(date.BookingIds)

  // If any are unconfirmed, display whole row in italics
  for (const id of uniqueBookingIds) {
    if (bookingDict[id]?.StatusCode === 'U') rowClass = classNames(rowClass, 'italic')
  }

  const total = date.BookingIds.length + date.RehearsalIds.length + date.OtherIds.length + date.GetInFitUpIds.length

  return (
    <div className="even:bg-black even:bg-opacity-5
      bg-blend-multiply border-b border-gray-300
      scroll-mt-20"
    id={`booking-${date.Date.replace('/', '-')}`}>
      <div className={rowClass} >
        <TourDisplay />
        <DateDisplay date={date.Date} />
        <div className="col-span-7 lg:col-span-8 grid grid-rows-auto gap-y-2 flex-grow pr-1">
          { uniqueBookingIds.map((id: number) => (
            <BookingDisplay key={id} bookingId={id} date={date.Date} performanceCount={date.PerformanceIds.length} />
          ))}
          { date.RehearsalIds.map((id) => (<RehearsalDisplay key={id} date={date.Date} rehearsalId={id} />))}
          { date.GetInFitUpIds.map((id) => (<GifuDisplay key={id} date={date.Date} gifuId={id} />))}
          { date.OtherIds.map((id) => (<OtherDisplay key={id} date={date.Date} otherId={id} />))}
          { total === 0 && (<div className="grid grid-cols-10"><CreateModal minimal date={date.Date}/></div>)}
        </div>
      </div>
    </div>
  )
}
