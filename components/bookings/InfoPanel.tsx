import { useRecoilValue } from 'recoil'
import { viewState } from 'state/booking/viewState'
import { BookingPanel } from './panel/BookingPanel'
import { RehearsalPanel } from './panel/RehearsalPanel'
import { DateViewModel, scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import { first, flat, unique } from 'radash'
import { PanelDrawer } from './panel/PanelDrawer'
import { PerformancePanel } from './panel/PerformancePanel'
import AddBooking from './panel/CreatePanel'
import { GifuPanel } from './panel/GifuPanel'
import { OtherPanel } from './panel/OtherPanel'
import { performanceState } from 'state/booking/performanceState'
import { bookingState } from 'state/booking/bookingState'
import { venueState } from 'state/booking/venueState'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { rehearsalState } from 'state/booking/rehearsalState'
import { getInFitUpState } from 'state/booking/getInFitUpState'

type PanelInfo = {
  id: number
  title: string
  icon?: IconProp
}

export const InfoPanel = () => {
  const view = useRecoilValue(viewState)
  const schedule = useRecoilValue(scheduleSelector)
  const perfDict = useRecoilValue(performanceState)
  const bookingDict = useRecoilValue(bookingState)
  const rehearsalDict = useRecoilValue(rehearsalState)
  const venueDict = useRecoilValue(venueState)
  const gifuDict = useRecoilValue(getInFitUpState)

  const { selectedDate } = view

  if (!selectedDate) {
    return (
      <div className="pl-4 mt-40 text-center flex flex-col items-center" >
        <h2 className="text-xl mb-2">No Date Selected</h2>
        <p>Select date to edit/create events</p>
      </div>
    )
  }

  const dates = flat(schedule.Sections.map(x => x.Dates))

  const date: DateViewModel = first(dates.filter(x => x.Date === selectedDate))

  const bookingIds = unique(date.BookingIds)
  const { RehearsalIds, PerformanceIds, GetInFitUpIds, OtherIds } = date

  const total = bookingIds.length + RehearsalIds.length + PerformanceIds.length + GetInFitUpIds.length + OtherIds.length
  const defaultOpen = total <= 1
  const createOpen = total === 0

  const sectionClass = 'bg-white rounded-lg px-2 pb-2 pt-px mb-8 shadow-md'

  const performances = PerformanceIds.map((id): PanelInfo => {
    const bookingId = perfDict[id].BookingId
    const venueId = bookingDict[bookingId].VenueId
    const venueName = venueDict[venueId].Name

    return {
      title: `Performance: ${venueName}`,
      id
    }
  })

  const rehearsals = RehearsalIds.map((id): PanelInfo => {
    const rehearsal = rehearsalDict[id]

    return {
      title: `Rehearsal: ${rehearsal.Town ? rehearsal.Town : 'N/A'}`,
      id,
      icon: rehearsal.StatusCode === 'U' ? faPencil : undefined
    }
  })

  const gifus = GetInFitUpIds.map((id): PanelInfo => {
    const gifu = gifuDict[id]
    const venueName = venueDict[gifu.VenueId].Name

    return {
      title: `GIFU: ${venueName}`,
      id,
      icon: gifu.StatusCode === 'U' ? faPencil : undefined
    }
  })

  const bookings = bookingIds.map((id): PanelInfo => {
    const booking = bookingDict[id]
    const venueId = booking.VenueId
    const venueName = venueDict[venueId].Name

    return {
      title: `Booking: ${venueName}`,
      id,
      icon: booking.StatusCode === 'U' ? faPencil : undefined
    }
  })

  return (
    <div>
      { !!bookings.length && (
        <div className={sectionClass}>
          { bookings.map(({ id, title, icon }) => (
            <PanelDrawer open={defaultOpen} key={id} title={title} icon={icon}>
              <BookingPanel key={id} bookingId={id} />
            </PanelDrawer>
          ))}
        </div>
      )}
      { !!rehearsals.length && (
        <div className={sectionClass}>
          { rehearsals.map(({ id, icon, title }) => (
            <PanelDrawer open={defaultOpen} key={id} title={title} icon={icon}>
              <RehearsalPanel key={id} rehearsalId={id} />
            </PanelDrawer>
          ))}
        </div>
      )}
      { !!gifus.length && (
        <div className={sectionClass}>
          { gifus.map(({ id, icon, title }) => (
            <PanelDrawer open={defaultOpen} key={id} title={title} icon={icon}>
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
      { !!performances.length && (
        <div className={sectionClass}>
          { performances.map(({ id, title }) => (
            <PanelDrawer open={defaultOpen} title={title} key={id}>
              <PerformancePanel key={id} performanceId={id} />
            </PanelDrawer>
          ))}
        </div>
      )}
      <div className={ sectionClass }>
        <PanelDrawer open={createOpen} title={'Create New'} intent='PRIMARY'>
          <AddBooking />
        </PanelDrawer>
      </div>
    </div>
  )
}
