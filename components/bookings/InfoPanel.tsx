import { useRecoilValue } from 'recoil'
import { viewState } from 'state/booking/viewState'
import { BookingPanel } from './panel/BookingPanel'
import { RehearsalPanel } from './panel/RehearsalPanel'
import { DateViewModel, scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import { first, flat, unique } from 'radash'
import { PanelDrawer } from './panel/PanelDrawer'
import { PerformancePanel } from './panel/PerformancePanel'
import AddBooking from './panel/CreatePanel'
import { bookingState } from 'state/booking/bookingState'
import { GifuPanel } from './panel/GifuPanel'
import { OtherPanel } from './panel/OtherPanel'

export const InfoPanel = () => {
  const view = useRecoilValue(viewState)
  const schedule = useRecoilValue(scheduleSelector)
  const bookingDict = useRecoilValue(bookingState)

  const { selectedDate } = view

  if (!selectedDate) {
    return (
      <div className="w-4/12 pl-4">

      </div>
    )
  }

  const dates = flat(schedule.Sections.map(x => x.Dates))

  const date: DateViewModel = first(dates.filter(x => x.Date === selectedDate))

  const bookingIds = unique(date.BookingIds)
  const { RehearsalIds, PerformanceIds, GetInFitUpIds, OtherIds } = date

  const defaultOpen = bookingIds.length + RehearsalIds.length + PerformanceIds.length + GetInFitUpIds.length + OtherIds.length <= 1

  const sectionClass = 'bg-white rounded-lg px-2 pb-2 pt-px mb-8 shadow-md'

  return (
    <div className="w-4/12 pl-2" >
      { !!bookingIds.length && (
        <div className={sectionClass}>
          { bookingIds.map(id => (
            <PanelDrawer open={defaultOpen} key={id} title="Booking">
              <BookingPanel key={id} bookingId={id} />
            </PanelDrawer>
          ))}
        </div>
      )}
      { !!RehearsalIds.length && (
        <div className={sectionClass}>
          { RehearsalIds.map(id => (
            <PanelDrawer open={defaultOpen} key={id} title="Rehearsal">
              <RehearsalPanel key={id} rehearsalId={id} />
            </PanelDrawer>
          ))}
        </div>
      )}
      { !!GetInFitUpIds.length && (
        <div className={sectionClass}>
          { GetInFitUpIds.map(id => (
            <PanelDrawer open={defaultOpen} key={id} title="Get-In Fit-Up">
              <GifuPanel key={id} gifuId={id} />
            </PanelDrawer>
          ))}
        </div>
      )}
      { !!OtherIds.length && (
        <div className={sectionClass}>
          { OtherIds.map(id => (
            <PanelDrawer open={defaultOpen} key={id} title="Other">
              <OtherPanel key={id} otherId={id} />
            </PanelDrawer>
          ))}
        </div>
      )}
      { !!PerformanceIds.length && (
        <div className={sectionClass}>
          { PerformanceIds.map((id, index) => (
            <PanelDrawer open={defaultOpen} title={`Performance ${index + 1}`} key={id}>
              <PerformancePanel key={id} performanceId={id} />
            </PanelDrawer>
          ))}
        </div>
      )}
      <div className={ sectionClass }>
        <PanelDrawer title={'Create New'} intent='PRIMARY'>
          <AddBooking />
        </PanelDrawer>
      </div>
    </div>
  )
}
