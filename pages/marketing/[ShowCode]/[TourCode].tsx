import Layout from 'components/Layout'
import { useState } from 'react'
import MarketingPanel from 'components/marketing/MarketingPanel'
import GlobalToolbar from 'components/toolbar'
import { GetServerSideProps } from 'next'
import { InitialState } from 'lib/recoil'
import { getSaleableBookings } from 'services/bookingService'
import { BookingJump } from 'state/marketing/bookingJumpState'
import { bookingMapperWithVenue, venueRoleMapper } from 'lib/mappers'
import { getRoles } from 'services/contactService'
import { getTourJumpState } from 'utils/getTourJumpState'
import { getAccountId, getEmailFromReq } from 'services/userService'

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
          title={'Marketing'} />
        <MarketingPanel />
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = await getEmailFromReq(ctx.req)
  const AccountId = await getAccountId(email)

  const tourJump = await getTourJumpState(ctx, 'marketing', AccountId)

  const TourId = tourJump.selected
  // TourJumpState is checking if it's valid to access by accountId
  if (!TourId) return { notFound: true }

  const bookings:any[] = await getSaleableBookings(TourId)
  const selected = bookings.filter((booking:any) => booking?.DateBlock?.TourId === TourId)?.[0]?.Id || null
  const venueRoles = await getRoles()
  const bookingJump: BookingJump = {
    selected,
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
