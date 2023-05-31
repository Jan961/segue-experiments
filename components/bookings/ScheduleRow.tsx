import classNames from 'classnames'
import { PropsWithChildren } from 'react'
import { useRecoilState } from 'recoil'
import { dateService } from 'services/dateService'
import { DateViewModel } from 'state/booking/selectors/scheduleSelector'
import { viewState } from 'state/booking/viewState'

interface ScheduleRowProps {
  date: DateViewModel
}

interface EventBadgeProps {
  rehearsal?: boolean
  booking?: boolean
  getInFitUp?: boolean
  performance?: boolean
}

interface CommonBadgeProps {
  className?: string
}

const CommonBadge = ({ children, className }: PropsWithChildren<CommonBadgeProps>) => {
  return <span className={classNames(className, 'inline-blocked p-2 rounded mr-2')} >{ children }</span>
}

const EventBadge = ({ rehearsal, booking, getInFitUp, performance }: EventBadgeProps) => {
  if (rehearsal) return <CommonBadge className="bg-red-500 text-white">Rehearsal</CommonBadge>
  if (booking) return <CommonBadge className="bg-blue-500 text-white">Booking</CommonBadge>
  if (performance) return <CommonBadge className="bg-blue-300 text-white">Performance</CommonBadge>
  if (getInFitUp) return <CommonBadge className="bg-amber-500 text-white">Get In Fit Up</CommonBadge>

  return <CommonBadge>Unknown</CommonBadge>
}

export const ScheduleRow = ({ date }: ScheduleRowProps) => {
  const [view, setView] = useRecoilState(viewState)

  const dateKey = date.Date.split('T')[0]

  const selected = view.selectedDate === date.Date.split('T')[0]

  const selectDate = (e: any) => {
    e.preventDefault()
    setView({ selectedDate: dateKey })
  }

  let rowClass = 'grid gap-1 grid-cols-10 py-3 w-full border-l-4 border-transparent'
  if (selected) rowClass += classNames(rowClass, 'bg-blue-200 border-blue-500')

  return (
    <button className="even:bg-gray-100 border-b border-gray-300" onClick={selectDate}>
      <div className={rowClass} >
        <div className="font-bold text-soft-primary-grey col-span-1 max-w-[50px]">
          ?
        </div>
        <div className="col-span-3 font-medium text-soft-primary-grey max-w-[150px]">
          { dateService.dateToSimple(date.Date) }
          <br />
          { dateService.getWeekDay(date.Date).slice(0, 3)}
        </div>
        <ul>
          { date.BookingIds.map((id) => <EventBadge booking key={'b-' + id} />)}
          { date.RehearsalIds.map((id) => <EventBadge rehearsal key={'r-' + id} />)}
          { date.GetInFitUpIds.map((id) => <EventBadge getInFitUp key={'g-' + id} />)}
          { date.PerformanceIds.map((id) => <EventBadge performance key={'g-' + id} />)}
        </ul>
      </div>
    </button>
  )
}
