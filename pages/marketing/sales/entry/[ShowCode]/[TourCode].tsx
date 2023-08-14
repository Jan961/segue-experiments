import Layout from 'components/Layout'
import { useState } from 'react'
import GlobalToolbar from 'components/toolbar'
import Entry from 'components/marketing/sales/entry'
import { GetServerSideProps } from 'next'
import { InitialState } from 'lib/recoil'
import { getSaleableBookings } from 'services/bookingService'
import { BookingJump } from 'state/marketing/bookingJumpState'
import { bookingMapperWithVenue, venueRoleMapper } from 'lib/mappers'
import { getRoles } from 'services/contactService'
import { getTourJumpState } from 'utils/getTourJumpState'

type Props = {
  initialState: InitialState
};

const Index = ({ initialState }: Props) => {
  const [searchFilter, setSearchFilter] = useState('')

  return (
    <Layout title="Marketing | Segue">
      <div className="flex flex-col px-4 flex-auto">
        <GlobalToolbar
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          page={'/sales/entry'}
          title={'Marketing'} />
        <Entry searchFilter={searchFilter} />
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { TourCode } = ctx.params

  const tourJump = await getTourJumpState(ctx, 'marketing/sales/entry')

  const tourId = tourJump.tours.filter(x => x.Code === TourCode)[0].Id

  const bookings = await getSaleableBookings(tourId)
  const venueRoles = await getRoles()

  const bookingJump: BookingJump = {
    selected: bookings[0] ? bookings[0].Id : undefined,
    bookings: bookings.map(bookingMapperWithVenue)
  }

  const initialState: InitialState = {
    global: {
      tourJump
    },
    marketing: {
      bookingJump,
      venueRole: venueRoles.map(venueRoleMapper)
    }
  }

  return { props: { initialState } }
}

export default Index
