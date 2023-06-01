import classNames from 'classnames'
import { BookingDTO } from 'interfaces'
import { PropsWithChildren } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { dateService } from 'services/dateService'
import { bookingDictSelector } from 'state/booking/selectors/bookingDictSelector'
import { DateViewModel } from 'state/booking/selectors/scheduleSelector'
import { venueDictSelector } from 'state/booking/selectors/venueDictSelector'
import { viewState } from 'state/booking/viewState'
import { VenueDisplay } from './VenueDisplay'
import { RehearsalDisplay } from './RehearsalDisplay'

interface ScheduleRowProps {
  date: DateViewModel
}

interface EventBadgeProps {
  rehearsal?: boolean
  booking?: boolean
  getInFitUp?: boolean
  performance?: boolean
  onClick?: (e: any) => void
}

interface CommonBadgeProps {
  className?: string
  onClick?: (e: any) => void
}

const CommonBadge = ({ children, className, onClick }: PropsWithChildren<CommonBadgeProps>) => {
  const nonPropogatedClick = (e: any) => {
    e.stopPropagation()
    onClick(e)
  }

  return <button onClick={nonPropogatedClick} className={classNames(className, 'inline-blocked px-2 rounded mr-2')} >{ children }</button>
}

const EventBadge = ({ rehearsal, booking, getInFitUp, performance, onClick }: EventBadgeProps) => {
  if (performance) return <CommonBadge onClick={onClick} className="bg-blue-300 text-white">Performance</CommonBadge>
  if (getInFitUp) return <CommonBadge onClick={onClick} className="bg-amber-500 text-white">Get In Fit Up</CommonBadge>

  return null
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

  let rowClass = 'grid gap-1 grid-cols-12 py-3 w-full border-l-4 border-transparent px-2'
  if (selected) rowClass += classNames(rowClass, 'bg-blue-200 border-blue-500')

  const select = async (newView: any) => {
    // Still highlight date
    const replacement = { selectedDate: dateKey, ...newView }
    setView(replacement)
  }

  const rehearsalId = date.RehearsalIds.length ? date.RehearsalIds[0] : undefined

  return (
    <div className="even:bg-gray-100 border-b border-gray-300" onClick={selectDate}>
      <div className={rowClass} >
        <div className="col-span-1 font-bold text-soft-primary-grey max-w-[25px]">
          ?
        </div>
        <div className="col-span-4 font-medium text-soft-primary-grey">
          { dateService.dateToSimple(date.Date) }
          <br />
          { dateService.getWeekDay(date.Date).slice(0, 3)}
        </div>
        <div className="col-span-7">
          { date.BookingIds.map((id: number) => (
            <VenueDisplay key={id} bookingId={id} />
          ))}
          <RehearsalDisplay rehearsalId={rehearsalId} />
          <ul>
            { date.BookingIds.map((id) => (
              <EventBadge onClick={() => select({ selectedBooking: id })} booking key={'b-' + id} />
            ))}
            { date.GetInFitUpIds.map((id) => (
              <EventBadge onClick={() => select({ selectedGetInFitUp: id })} getInFitUp key={'g-' + id} />
            ))}
            { date.PerformanceIds.map((id, index) => (
              <EventBadge onClick={() => select({ selectedBooking: id })} performance key={`p-${dateKey}-${index}`} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
