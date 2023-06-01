import React from 'react'
import { GetServerSideProps } from 'next'
import GlobalToolbar from 'components/toolbar'
import BookingsButtons from 'components/bookings/bookingsButtons'
import Layout from 'components/Layout'
import { TourContent, getTourWithContent, lookupTourId } from 'services/TourService'
import { InfoPanel } from 'components/bookings/InfoPanel'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { venueState } from 'state/booking/venueState'
import { BookingDTO, DateBlockDTO, GetInFitUpDTO, RehearsalDTO, VenueMinimalDTO } from 'interfaces'
import { bookingState } from 'state/booking/bookingState'
import { rehearsalState } from 'state/booking/rehearsalState'
import { getInFitUpState } from 'state/booking/getInFitUpState'
import { DateViewModel, ScheduleSectionViewModel, scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import { dateBlockState } from 'state/booking/dateBlockState'
import { bookingMapper, dateBlockMapper, getInFitUpMapper, rehearsalMapper } from 'lib/mappers'
import { ScheduleRow } from 'components/bookings/ScheduleRow'
import { DateDistancesDTO, DistanceStop, getAllVenuesMin, getDistances } from 'services/venueService'
import { distanceState } from 'state/booking/distanceState'

interface InitialData {
  bookings: BookingDTO[],
  rehearsals: RehearsalDTO[],
  getInFitUp: GetInFitUpDTO[],
  dateBlock: DateBlockDTO[],
  distance: DateDistancesDTO[],
  venue: VenueMinimalDTO[],
}

interface bookingProps {
  Id: number,
  initialData: InitialData
}

const BookingPage = ({ initialData, Id }: bookingProps) => {
  const [searchFilter, setSearchFilter] = React.useState('')

  const setVenue = useSetRecoilState(venueState)
  const setBookings = useSetRecoilState(bookingState)
  const setRehearsals = useSetRecoilState(rehearsalState)
  const setGetInFitUp = useSetRecoilState(getInFitUpState)
  const setDateBlock = useSetRecoilState(dateBlockState)
  const setDistance = useSetRecoilState(distanceState)

  const { Sections } = useRecoilValue(scheduleSelector)

  // Run only once
  const count = React.useRef(0)
  React.useEffect(() => {
    if (count.current !== 0) {
      setBookings(initialData.bookings)
      setRehearsals(initialData.rehearsals)
      setGetInFitUp(initialData.getInFitUp)
      setDateBlock(initialData.dateBlock)
      setVenue(initialData.venue)
      setDistance(initialData.distance)
    }
    count.current++
  }, [])

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
          <div className="flex flex-row w-full mb-6">
            <button className="text-primary-blue font-bold text-sm self-center mr-4 ml-4">
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
              <>
                <h3 className='font-bold border-b-2 mt-8'>{section.Name}</h3> {
                  section.Dates.map((date: DateViewModel) => (
                    <ScheduleRow key={date.Date} date={date}/>
                  ))
                }
              </>
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
  const { Id } = await lookupTourId(ShowCode as string, TourCode as string)
  const venues = await getAllVenuesMin()
  const tour: TourContent = await getTourWithContent(Id)

  const rehearsals: RehearsalDTO[] = []
  const bookings: BookingDTO[] = []
  const getInFitUp: GetInFitUpDTO[] = []
  const dateBlock: DateBlockDTO[] = []

  // Map to DTO. The database can change and we want to control. More info in mappers.ts
  for (const db of tour.DateBlock) {
    dateBlock.push(dateBlockMapper(db))

    db.Rehearsal.forEach(r => rehearsals.push(rehearsalMapper(r)))
    db.Booking.forEach(b => bookings.push(bookingMapper(b)))
    db.GetInFitUp.forEach(gifu => getInFitUp.push(getInFitUpMapper(gifu)))
  }

  // Get distances
  const grouped = bookings.reduce((acc, { VenueId, Date }) => {
    (acc[Date] = acc[Date] || []).push(VenueId)
    return acc
  }, {})

  const stops = Object.entries(grouped).map(([Date, Ids]): DistanceStop => ({ Date, Ids: Ids as number[] }))
  stops.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())

  const distance = await getDistances(stops)

  const initialData: InitialData = {
    rehearsals,
    bookings,
    getInFitUp,
    distance,
    dateBlock: dateBlock.sort((a, b) => { return b.StartDate < a.StartDate ? 1 : -1 }),
    // Remove extra info
    venue: venues.map((v: any) => ({ Id: v.Id, Code: v.Code, Name: v.Name }))
  }

  return {
    props: {
      Id,
      initialData
    }
  }
}
