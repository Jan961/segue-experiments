import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import GlobalToolbar from 'components/toolbar'
import BookingsButtons from 'components/bookings/bookingsButtons'
import React from 'react'
import Layout from 'components/Layout'
import { TourContent, getTourWithContent, lookupTourId } from 'services/TourService'
import { InfoPanel } from 'components/bookings/InfoPanel'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { venueState } from 'state/booking/venueState'
import { BookingDTO, DateBlockDTO, GetInFitUpDTO, RehearsalDTO } from 'interfaces'
import { bookingState } from 'state/booking/bookingState'
import { rehearsalState } from 'state/booking/rehearsalState'
import { getInFitUpState } from 'state/booking/getInFitUpState'
import { DateViewModel, ScheduleSectionViewModel, scheduleSelector } from 'state/booking/selectors/scheduleSelector'
import { dateBlockState } from 'state/booking/dateBlockState'
import { dateBlockMapper } from 'interfaces/mappers'
import { ScheduleRow } from 'components/bookings/ScheduleRow'

interface InitialData {
  bookings: BookingDTO[],
  rehearsals: RehearsalDTO[],
  getInFitUp: GetInFitUpDTO[],
  dateBlock: DateBlockDTO[]
}

interface bookingProps {
  Id: number,
  initialData: InitialData
}

const BookingPage = ({ initialData, Id }: bookingProps) => {
  const [searchFilter, setSearchFilter] = useState('')

  const [selectedBooking, setSelectedBooking] = useState(0)
  const setVenues = useSetRecoilState(venueState)
  const setBookings = useSetRecoilState(bookingState)
  const setRehearsals = useSetRecoilState(rehearsalState)
  const setGetInFitUp = useSetRecoilState(getInFitUpState)
  const setDateBlockState = useSetRecoilState(dateBlockState)
  const { Sections } = useRecoilValue(scheduleSelector)

  useEffect(() => {
    fetch('/api/venue/read/allVenues/0')
      .then((res) => res.json())
      .then((venues) => {
        setVenues(venues)
      })
  }, [])

  // Run only once
  const count = React.useRef(0)
  useEffect(() => {
    if (count.current !== 0) {
      setBookings(initialData.bookings)
      setRehearsals(initialData.rehearsals)
      setGetInFitUp(initialData.getInFitUp)
      setDateBlockState(initialData.dateBlock)
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
      <BookingsButtons key={'toolbar'} selectedBooking={selectedBooking} currentTourId={Id} ></BookingsButtons>
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

        { selectedBooking && (<InfoPanel selectedBooking={selectedBooking} setSelectedBooking={setSelectedBooking} />) }

      </div>

    </Layout>
  )
}

export default BookingPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ShowCode, TourCode } = ctx.query
  const { Id } = await lookupTourId(ShowCode as string, TourCode as string)
  const tour: TourContent = await getTourWithContent(Id)

  let rehearsals: RehearsalDTO[] = []
  let bookings: BookingDTO[] = []
  let getInFitUp: GetInFitUpDTO[] = []
  const dateBlock: DateBlockDTO[] = []

  for (const db of tour.DateBlock) {
    dateBlock.push(dateBlockMapper(db))
    rehearsals = [...rehearsals, ...db.Rehearsal.map((r) => ({ Date: r.Date.toISOString(), Id: r.Id }))]
    bookings = [...bookings, ...db.Booking.map((b) => (
      {
        Date: b.FirstDate.toISOString(),
        Id: b.Id,
        Performances: b.Performance.map((p) => {
          const day = p.Date.toISOString().split('T')[0]
          const time = p.Time.toISOString().split('T')[1]
          return `${day}T${time}`
        })
      }))]
    getInFitUp = [...getInFitUp, ...db.GetInFitUp.map((gifu) => ({ Date: gifu.Date.toISOString(), Id: gifu.Id }))]
  }

  console.log(bookings)

  const initialData: InitialData = {
    rehearsals,
    bookings,
    getInFitUp,
    dateBlock: dateBlock.sort((a, b) => { return b.StartDate < a.StartDate ? 1 : -1 })
  }

  return {
    props: {
      Id,
      initialData
    }
  }
}
