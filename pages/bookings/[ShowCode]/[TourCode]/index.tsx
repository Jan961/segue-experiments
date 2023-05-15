import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import GlobalToolbar from 'components/toolbar'
import BookingsButtons from 'components/bookings/bookingsButtons'
import Layout from 'components/Layout'
import BookingDetailRow from 'components/bookings/bookingDetailRow'
import { userService } from 'services/user.service'
import { getTourByCode } from 'services/TourService'
import { InfoPanel } from 'components/bookings/InfoPanel'
import { useSetRecoilState } from 'recoil'
import { venueState } from 'state/venueState'
import { dayTypeState } from 'state/dayTypeState'

interface bookingProps {
  TourCode: string,
  ShowCode: string,
  TourId: number,
}

const BookingPage = ({ TourCode, ShowCode, TourId }: bookingProps) => {
  const [bookings, setBookings] = useState([]) // This is all of the bookings list
  const [searchFilter, setSearchFilter] = useState('')

  const [selectedBooking, setSelectedBooking] = useState(0)
  const setVenues = useSetRecoilState(venueState)
  const setDayTypes = useSetRecoilState(dayTypeState)

  useEffect(() => {
    fetch(`/api/venue/read/allVenues/${userService.userValue.accountId}`)
      .then((res) => res.json())
      .then((venues) => {
        setVenues(venues)
      })
  }, [])

  useEffect(() => {
    fetch('/api/utilities/dropdowns/dayTypes')
      .then((res) => res.json())
      .then((dayTypes) => {
        setDayTypes(dayTypes)
      })
  }, [])

  useEffect(() => {
    fetch(`/api/bookings/${TourId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data[0] !== undefined) {
          setSelectedBooking(data[0].BookingId)
        }
        setBookings(data)
      })
  }, [TourId])

  const gotoToday = () => {
    const element = new Date().toISOString().substring(0, 10)
    if (document.getElementById(`${element}`) !== null) {
      document.getElementById(`${element}`).scrollIntoView({ behavior: 'smooth' })
    } else {
      alert('Today is not a date on this tour')
    }
  }

  function handleClick (BookingId) {
    setSelectedBooking(BookingId)
  }

  return (
    <Layout title="Booking | Seque">
      {/* <TourJumpMenu></TourJumpMenu> */}
      <GlobalToolbar
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        title={'Bookings'}
      ></GlobalToolbar>

      <BookingsButtons key={'toolbar'} selectedBooking={selectedBooking} currentTourId={TourId} ></BookingsButtons>
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
            {bookings.map((booking, index) => (
              <div
                key={new Date(booking.ShowDate).toISOString().substring(0, 10)}
                id={booking.ShowDate.substring(0, 10)}
                className={`grid grid-cols-1 space-y-4 ${
                  index % 2 === 0 ? 'bg-faded-primary-grey' : ''
                }`}

              >
                <button type={'button'} onClick={() => handleClick(booking.BookingId)}>
                  <BookingDetailRow booking={booking}></BookingDetailRow>
                </button>
              </div>
            ))}
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
  const { TourId } = await getTourByCode(ShowCode as string, TourCode as string)

  return {
    props: {
      TourCode,
      ShowCode,
      TourId
    }
  }
}
