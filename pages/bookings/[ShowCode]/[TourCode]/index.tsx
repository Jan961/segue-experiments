import React from 'react'
import { GetServerSideProps } from 'next'
import GlobalToolbar from 'components/toolbar'
import BookingsButtons from 'components/bookings/bookingsButtons'
import Layout from 'components/Layout'
import { TourContent, getTourWithContent, lookupTourId } from 'services/TourService'
import { InfoPanel } from 'components/bookings/InfoPanel'
import { useRecoilValue } from 'recoil'
import { BookingDTO, DateBlockDTO, GetInFitUpDTO, RehearsalDTO } from 'interfaces'
import { DateViewModel, ScheduleSectionViewModel, scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import { bookingMapper, dateBlockMapper, getInFitUpMapper, rehearsalMapper } from 'lib/mappers'
import { ScheduleRow } from 'components/bookings/ScheduleRow'
import { DistanceStop, getAllVenuesMin, getDistances } from 'services/venueService'
import { InitialState } from 'lib/recoil'

interface bookingProps {
  Id: number,
  intitialState: InitialState
}

const BookingPage = ({ Id }: bookingProps) => {
  const [searchFilter, setSearchFilter] = React.useState('')
  const { Sections } = useRecoilValue(scheduleSelector)

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
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        title={'Bookings'}
      ></GlobalToolbar>
      <BookingsButtons key={'toolbar'} selectedBooking={undefined} currentTourId={Id} ></BookingsButtons>
      <div className="flex flex-auto">
        {/* <SideMenu></SideMenu> */}
        {/* need to pass the full list of booking */}
        <div className="w-full p-4 overflow-y-scroll max-h-1200">
          <div className="flex flex-row w-full mb-2">
            <button className="text-primary-blue font-bold text-sm self-center px-2">
              Week
            </button>
            <button
              className="inline-flex items-center rounded-md border border-transparent bg-primary-blue px-8 py-1 text-xs font-normal leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 h-4/5"
              onClick={() => gotoToday()}
            >
              Go to Today
            </button>
          </div>
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
        </div>
        <InfoPanel />
      </div>
    </Layout>
  )
}

export default BookingPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  /*
    We get the data for the whole booking page here. We pass it to the constructor, then store it in state management.
    This means we can update a single booking, and the schedule will update without having to redownload all the data.
    We have effectively cloned the database for this tour, and populate it using the results of a single query which includes 'everything we want
    to display'.

    The itinery or miles will be different however, as this relies on the preview booking, and has to be generateed programatically
  */

  const { ShowCode, TourCode } = ctx.query
  console.log(`ServerSideProps: ${ShowCode}/${TourCode}`)
  const { Id } = await lookupTourId(ShowCode as string, TourCode as string)
  console.log(`Found tour ${Id}`)
  const venues = await getAllVenuesMin()
  console.log(`Retrieved venues (${venues.length})`)
  const tour: TourContent = await getTourWithContent(Id)
  console.log(`Retrieved main content. Tour: ${tour.Id}`)

  const rehearsal: RehearsalDTO[] = []
  const booking: BookingDTO[] = []
  const getInFitUp: GetInFitUpDTO[] = []
  const dateBlock: DateBlockDTO[] = []

  // Map to DTO. The database can change and we want to control. More info in mappers.ts
  for (const db of tour.DateBlock) {
    dateBlock.push(dateBlockMapper(db))

    db.Rehearsal.forEach(r => rehearsal.push(rehearsalMapper(r)))
    db.Booking.forEach(b => booking.push(bookingMapper(b)))
    db.GetInFitUp.forEach(gifu => getInFitUp.push(getInFitUpMapper(gifu)))
  }

  // Get distances
  const grouped = booking.reduce((acc, { VenueId, Date }) => {
    (acc[Date] = acc[Date] || []).push(VenueId)
    return acc
  }, {})

  const stops = Object.entries(grouped).map(([Date, Ids]): DistanceStop => ({ Date, Ids: Ids as number[] }))
  stops.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())

  const distance = await getDistances(stops)

  // See _app.tsx for how this is picked up
  const intitialState: InitialState = {
    rehearsal,
    booking,
    getInFitUp,
    distance,
    dateBlock: dateBlock.sort((a, b) => { return b.StartDate < a.StartDate ? 1 : -1 }),
    // Remove extra info
    venue: venues.map((v: any) => ({ Id: v.Id, Code: v.Code, Name: v.Name }))
  }

  return {
    props: {
      Id,
      intitialState
    }
  }
}
