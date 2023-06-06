import { useRecoilValue } from 'recoil'
import { viewState } from 'state/booking/viewState'
import { BookingPanel } from './panel/BookingPanel'
import { RehearsalPanel } from './panel/RehearsalPanel'
import { DateViewModel, scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import { first, flat, unique } from 'radash'
import { PanelDrawer } from './panel/PanelDrawer'

export const InfoPanel = () => {
  const view = useRecoilValue(viewState)
  const schedule = useRecoilValue(scheduleSelector)
  const { selectedDate } = view

  if (!selectedDate) {
    return (
      <div className="w-6/12 pl-4">

      </div>
    )
  }

  const dates = flat(schedule.Sections.map(x => x.Dates))

  const date: DateViewModel = first(dates.filter(x => x.Date === selectedDate))

  const bookingIds = unique(date.BookingIds)
  const rehearsalIds = date.RehearsalIds
  const performances = date.PerformanceIds

  return (
    <div className="w-6/12 pl-2" >
      <div className="bg-white rounded-lg px-2 pb-2 pt-1">
        { bookingIds.map(id => (
          <PanelDrawer open key={id} title="Booking">
            <BookingPanel key={id} bookingId={id} />
          </PanelDrawer>
        ))}
        { rehearsalIds.map(id => (
          <PanelDrawer open key={id} title="Rehearsal">
            <RehearsalPanel key={id} rehearsalId={id} />
          </PanelDrawer>
        ))}
        { performances.map(p => (
          <PanelDrawer open title="Performance" key={p}>
            <h2>WIP</h2>
          </PanelDrawer>
        ))}
      </div>
    </div>
  )
}
