import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'
import GlobalToolbar from 'components/toolbar'
import BookingsButtons from 'components/bookings/bookingsButtons'
import Layout from 'components/Layout'
import BookingDetailRow from 'components/bookings/bookingDetailRow'
import { userService } from 'services/user.service'
import { TourWithBookingsType, getTourWithBookingsById, lookupTourId } from 'services/TourService'
import { InfoPanel } from 'components/bookings/InfoPanel'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { venueState } from 'state/venueState'
import { dayTypeState } from 'state/dayTypeState'
import { bookingState } from 'state/bookingState'

interface bookingProps {
  Id: number,
  tour: TourWithBookingsType
}

const BookingPage = ({ tour, Id }: bookingProps) => {
  const { DateBlock } = tour
  const [searchFilter, setSearchFilter] = useState('')

  const [selectedBooking, setSelectedBooking] = useState(0)
  const setVenues = useSetRecoilState(venueState)
  const setDayTypes = useSetRecoilState(dayTypeState)
  const [bookings, setBookings] = useRecoilState(bookingState)

  const initialBookings = []

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
    // SSR - We need a better way to set this before the page is mounted.
    if (initialBookings?.length > 0) {
      setBookings(initialBookings)
      setSelectedBooking(initialBookings[0].Id)
    }
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
            { DateBlock.map((block) => (
              <>
                <h3>{block.Name}</h3> {
                  block.Booking.map((booking) => (
                    <BookingDetailRow
                      key={booking.Id}
                      selected={booking.Id === selectedBooking}
                      onClick={() => setSelectedBooking(booking.Id)}
                      booking={booking} />
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
  const tour = await getTourWithBookingsById(Id)
  // const blocks = bookingMapper(tour)
  // console.log(blocks)

  return {
    props: {
      Id,
      tour
    }
  }
}
