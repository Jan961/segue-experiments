import { GetServerSideProps } from 'next'
import GlobalToolbar from 'components/toolbar'
import BookingsButtons from 'components/bookings/bookingsButtons'
import Layout from 'components/Layout'
import { TourContent, getToursByShowCode, getTourWithContent, lookupTourId } from 'services/TourService'
import { InfoPanel } from 'components/bookings/InfoPanel'
import { useRecoilState, useRecoilValue } from 'recoil'
import { DateViewModel, ScheduleSectionViewModel } from 'state/booking/selectors/scheduleSelector'
import { DateTypeMapper, bookingMapper, dateBlockMapper, getInFitUpMapper, otherMapper, performanceMapper, rehearsalMapper } from 'lib/mappers'
import { ScheduleRow } from 'components/bookings/ScheduleRow'
import { DistanceStop, getAllVenuesMin, getDistances } from 'services/venueService'
import { InitialState } from 'lib/recoil'
import { BookingsWithPerformances } from 'services/bookingService'
import { objectify } from 'radash'
import { getDayTypes } from 'services/dayTypeService'
import { filterState } from 'state/booking/filterState'
import { filteredScheduleSelector } from 'state/booking/selectors/filteredScheduleSelector'
import { FormInputButton } from 'components/global/forms/FormInputButton'
import { TourJump, tourJumpState } from 'state/booking/tourJumpState'
import { ParsedUrlQuery } from 'querystring'
import { Spinner } from 'components/global/Spinner'

interface bookingProps {
  Id: number,
  intitialState: InitialState
}

const BookingPage = ({ Id }: bookingProps) => {
  const schedule = useRecoilValue(filteredScheduleSelector)
  const { Sections } = schedule
  const [filter, setFilter] = useRecoilState(filterState)
  const { loading } = useRecoilValue(tourJumpState)

  const gotoToday = () => {
    const element = new Date().toISOString().substring(0, 10)
    if (document.getElementById(`${element}`) !== null) {
      document.getElementById(`${element}`).scrollIntoView({ behavior: 'smooth' })
    } else {
      alert('Today is not a date on this tour')
    }
  }

  return (
    <Layout title="Booking | Seque">
      {/* <TourJumpMenu></TourJumpMenu> */}
      <GlobalToolbar
        searchFilter={filter.venueText}
        setSearchFilter={(venueText) => setFilter({ venueText })}
        title={'Bookings'}
      ></GlobalToolbar>
      <div className='flex mb-4 items-center'>
        <div>
          <button className="text-primary-blue font-bold text-sm self-center px-2">
            Week ??
          </button>
          <FormInputButton
            intent='PRIMARY'
            onClick={() => gotoToday()}
            text="Go to Today" />
        </div>
        <BookingsButtons key={'toolbar'} selectedBooking={undefined} currentTourId={Id} ></BookingsButtons>
      </div>
      <div className="flex flex-auto">
        <div className="w-full p-4 pt-0 max-h-1200">
          { loading && (
            <Spinner size="lg" className="mt-32 mb-8"/>
          )}
          { !loading && (
            <ul className="grid">
              { Sections.map((section: ScheduleSectionViewModel) => (
                <li key={section.Name}>
                  <h3 className='font-bold mt-3 mb-3'>{section.Name}</h3> {
                    section.Dates.map((date: DateViewModel) => (
                      <ScheduleRow key={date.Date} date={date} />
                    ))
                  }
                </li>
              ))
              }
            </ul>
          )}
        </div>
        <InfoPanel />
      </div>
    </Layout>
  )
}

export default BookingPage

interface Params extends ParsedUrlQuery {
  ShowCode: string
  TourCode: string
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  /*
    We get the data for the whole booking page here. We pass it to the constructor, then store it in state management.
    This means we can update a single booking, and the schedule will update without having to redownload all the data.
    We have effectively cloned the database for this tour, and populate it using the results of a single query which includes 'everything we want
    to display'.

    The itinery or miles will be different however, as this relies on the preview booking, and has to be generateed programatically
  */

  const { ShowCode, TourCode } = ctx.query as Params
  console.log(`ServerSideProps: ${ShowCode}/${TourCode}`)
  const { Id } = await lookupTourId(ShowCode, TourCode)
  console.log(`Found tour ${Id}`)
  const venues = await getAllVenuesMin()
  console.log(`Retrieved venues (${venues.length})`)
  const tour: TourContent = await getTourWithContent(Id)
  console.log(`Retrieved main content. Tour: ${tour.Id}`)

  const dateBlock = []
  const rehearsal = {}
  const booking = {}
  const getInFitUp = {}
  const performance = {}
  const other = {}

  // Map to DTO. The database can change and we want to control. More info in mappers.ts
  for (const db of tour.DateBlock) {
    dateBlock.push(dateBlockMapper(db))
    db.Other.forEach(o => { other[o.Id] = otherMapper(o) })
    db.Rehearsal.forEach(r => { rehearsal[r.Id] = rehearsalMapper(r) })
    db.GetInFitUp.forEach(gifu => { getInFitUp[gifu.Id] = getInFitUpMapper(gifu) })
    db.Booking.forEach(b => {
      booking[b.Id] = bookingMapper(b as BookingsWithPerformances)
      b.Performance.forEach(p => { performance[p.Id] = performanceMapper(p) })
    })
  }

  // Get distances
  const grouped = Object.values(booking).reduce((acc, { VenueId, Date }) => {
    (acc[Date] = acc[Date] || []).push(VenueId)
    return acc
  }, {})

  const stops = Object.entries(grouped).map(([Date, Ids]): DistanceStop => ({ Date, Ids: Ids as number[] }))
  stops.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())

  // Extra info, Run in parallel
  const [toursRaw, dateTypeRaw, distance] = await Promise.all([
    getToursByShowCode(ShowCode as string),
    getDayTypes(),
    getDistances(stops)]
  )

  const tourJump: TourJump = {
    tours: toursRaw.map((t: any) => (
      {
        Code: t.Code,
        IsArchived: t.IsArchived,
        ShowCode: t.Show.Code
      })),
    selected: TourCode
  }

  // See _app.tsx for how this is picked up
  const intitialState: InitialState = {
    rehearsal,
    booking,
    getInFitUp,
    other,
    tourJump,
    dateType: dateTypeRaw.map(DateTypeMapper),
    distance,
    performance,
    dateBlock: dateBlock.sort((a, b) => { return b.StartDate < a.StartDate ? 1 : -1 }),
    // Remove extra info
    venue: objectify(venues, v => v.Id, (v: any) => ({ Id: v.Id, Code: v.Code, Name: v.Name }))
  }

  return {
    props: {
      Id,
      intitialState
    }
  }
}
