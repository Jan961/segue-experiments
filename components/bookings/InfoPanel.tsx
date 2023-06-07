import { useRecoilValue } from 'recoil'
import { viewState } from 'state/booking/viewState'
import { BookingPanel } from './panel/BookingPanel'
import { RehearsalPanel } from './panel/RehearsalPanel'
import { DateViewModel, scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import { first, flat, unique } from 'radash'
import { PanelDrawer } from './panel/PanelDrawer'
import { PerformancePanel } from './panel/PerformancePanel'

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

  const sectionClass = 'bg-white rounded-lg px-2 pb-2 pt-px mb-4 shadow-md'

  return (
    <div className="w-6/12 pl-2" >
      { !!bookingIds.length && (
        <div className={sectionClass}>
          { bookingIds.map(id => (
            <PanelDrawer open key={id} title="Booking">
              <BookingPanel key={id} bookingId={id} />
            </PanelDrawer>
          ))}
        </div>
      )}
      { !!rehearsalIds.length && (
        <div className={sectionClass}>
          { rehearsalIds.map(id => (
            <PanelDrawer open key={id} title="Rehearsal">
              <RehearsalPanel key={id} rehearsalId={id} />
            </PanelDrawer>
          ))}
        </div>
      )}
      { !!performances.length && (
        <div className={sectionClass}>
          { performances.map((id, index) => (
            <PanelDrawer open title={`Performance ${index + 1}`} key={id}>
              <PerformancePanel key={id} performanceId={id} />
            </PanelDrawer>
          ))}
        </div>
      )}
    </div>
  )
}
