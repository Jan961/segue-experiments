import { GetServerSideProps } from 'next'
import GlobalToolbar from 'components/toolbar'
import BookingsButtons from 'components/bookings/bookingsButtons'
import Layout from 'components/Layout'
import { TourContent, getTourWithContent, lookupTourId } from 'services/TourService'
import { InfoPanel } from 'components/bookings/InfoPanel'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { DateViewModel, ScheduleSectionViewModel } from 'state/booking/selectors/scheduleSelector'
import { DateTypeMapper, bookingMapper, dateBlockMapper, getInFitUpMapper, otherMapper, performanceMapper, rehearsalMapper } from 'lib/mappers'
import { ScheduleRow } from 'components/bookings/ScheduleRow'
import { getAllVenuesMin, getDistances } from 'services/venueService'
import { InitialState } from 'lib/recoil'
import { BookingsWithPerformances } from 'services/bookingService'
import { first, objectify } from 'radash'
import { getDayTypes } from 'services/dayTypeService'
import { filterState } from 'state/booking/filterState'
import { filteredScheduleSelector } from 'state/booking/selectors/filteredScheduleSelector'
import { tourJumpState } from 'state/booking/tourJumpState'
import { ParsedUrlQuery } from 'querystring'
import { Spinner } from 'components/global/Spinner'
import { ToolbarButton } from 'components/bookings/ToolbarButton'
import { MileageCalculator } from 'components/bookings/MileageCalculator'
import { getStops } from 'utils/getStops'
import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'
import { getTourJumpState } from 'utils/getTourJumpState'
import { all } from 'radash'
import { viewState } from 'state/booking/viewState'

interface bookingProps {
  Id: number,
  intitialState: InitialState
}

const toolbarHeight = 136

interface ScrollablePanelProps {
  className: string
  reduceHeight: number
}

// Based on toolbar height. Adds a tasteful shadow when scrolled to prevent strange cut off
const ScrollablePanel = ({ children, className, reduceHeight }: PropsWithChildren<ScrollablePanelProps>) => {
  const [scrolled, setScrolled] = React.useState(false)

  const handleScroll = (e) => {
    setScrolled(e.target.scrollTop > 0)
  }

  const panelClasses = classNames(
    'overflow-y-auto relative',
    {
      'shadow-inner': scrolled
    }
  )

  return (
    <div
      onScroll={handleScroll}
      className={classNames(className, panelClasses)}
      style={{
        height: `calc(100vh - ${reduceHeight}px)`
      }}
    >
      { children }
    </div>
  )
}

const BookingPage = ({ Id }: bookingProps) => {
  const schedule = useRecoilValue(filteredScheduleSelector)
  const { Sections } = schedule
  const [filter, setFilter] = useRecoilState(filterState)
  const [view, setView] = useRecoilState(viewState)
  const { loading } = useRecoilValue(tourJumpState)
  const todayKey = new Date().toISOString().substring(0, 10)
  const todayOnSchedule = Sections.map(x => x.Dates).flat().filter(x => x.Date === todayKey).length > 0

  const gotoToday = () => {
    const idToScrollTo = `booking-${todayKey}`
    if (todayOnSchedule) {
      document.getElementById(`${idToScrollTo}`).scrollIntoView({ behavior: 'smooth' })
      setView({ ...view, selectedDate: todayKey })
    }
  }

  return (
    <Layout title="Booking | Segue" flush>
      {/* <TourJumpMenu></TourJumpMenu> */}
      <div className='px-4'>
        <GlobalToolbar
          searchFilter={filter.venueText}
          setSearchFilter={(venueText) => setFilter({ venueText })}
          title={'Bookings'}
        >
          { /* <ToolbarInfo label='Week' value={"??"} /> */ }
          <MileageCalculator />
          <ToolbarButton
            disabled={!todayOnSchedule}
            onClick={() => gotoToday()}>
            Go To Today
          </ToolbarButton>
          <BookingsButtons key={'toolbar'} currentTourId={Id} ></BookingsButtons>
        </GlobalToolbar>
      </div>
      <div className='grid grid-cols-12'>
        <ScrollablePanel className="mx-0 col-span-7 lg:col-span-8 xl:col-span-9" reduceHeight={toolbarHeight}>
          { loading && (
            <Spinner size="lg" className="mt-32 mb-8"/>
          )}
          { !loading && (
            <>
              <div className="grid grid-cols-12 font-bold
                text-center
                text-sm xl:text-md
                sticky inset-x-0 top-0 bg-gray-50 z-10
                shadow-lg
                text-gray-400
                ">
                <div className="col-span-1 p-2 hidden xl:inline-block ">
                  Tour
                </div>
                <div className='col-span-4 lg:col-span-3 xl:col-span-2 p-2 whitespace-nowrap'>
                  Week No. & Date
                </div>
                <div className="col-span-8 lg:col-span-9 grid grid-cols-10">
                  <div className='col-span-7 p-2'>
                    Venue
                  </div>
                  <div className='col-span-1 p-2'>
                    Perf(s)
                  </div>
                  <div className='col-span-1 p-2'>
                    Miles
                  </div>
                  <div className='col-span-1 p-2'>
                    Time
                  </div>
                </div>
              </div>
              <ul className="grid w-full shadow">
                { Sections.map((section: ScheduleSectionViewModel) => (
                  <li key={section.Name}>
                    <h3 className='font-bold p-3 bg-gray-300'>{section.Name}</h3> {
                      section.Dates.map((date: DateViewModel) => (
                        <ScheduleRow key={date.Date} date={date} />
                      ))
                    }
                  </li>
                ))
                }
              </ul>
            </>
          )}
        </ScrollablePanel>
        <ScrollablePanel reduceHeight={toolbarHeight} className='col-span-5 lg:col-span-4 xl:col-span-3 p-2 bg-primary-blue'>
          <InfoPanel />
        </ScrollablePanel>
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
  const { Id } = await lookupTourId(ShowCode, TourCode) || {}
  console.log(`Found tour ${Id}`)

  // Get in parallel
  const [venues, tour, dateTypeRaw, tourJump] = await all([
    getAllVenuesMin(),
    getTourWithContent(Id),
    getDayTypes(),
    getTourJumpState(ctx, 'bookings')
  ])

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

  const stops = getStops(booking)
  const distanceStops = await getDistances(stops)

  const distance = {
    stops: distanceStops,
    outdated: false,
    tourCode: TourCode
  }

  // See _app.tsx for how this is picked up
  const initialState: InitialState = {
    global: {
      tourJump
    },
    booking: {
      rehearsal,
      booking,
      getInFitUp,
      other,
      dateType: dateTypeRaw.map(DateTypeMapper),
      distance,
      performance,
      dateBlock: dateBlock.sort((a, b) => { return b.StartDate < a.StartDate ? 1 : -1 }),
      // Remove extra info
      venue: objectify(venues, v => v.Id, (v: any) => ({ Id: v.Id, Code: v.Code, Name: v.Name }))
    }
  }

  return {
    props: {
      Id,
      initialState
    }
  }
}
